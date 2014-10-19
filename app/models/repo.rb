class Repo
  REPO_ROOT = File.join(Rails.root, "tmp", "repos")

  attr_accessor :owner, :name, :owner_and_name, :url

  def self.recent
    `cd #{REPO_ROOT} && ls -1trd */* | tail -5`.lines.map(&:chomp).map{|repo| new(repo)}.reverse
    # TODO: Delete repos that are not top 5 that are older than some period of time, to free up disk space.
  end

  def initialize(owner_and_name = nil)
    if owner_and_name
      self.owner_and_name = owner_and_name
      self.url = "https://github.com/#{owner_and_name}.git"
      self.owner = owner_and_name.split('/').first
      self.name = owner_and_name.split('/').last
    end
  end

  def save; true; end

  def persisted?; false; end

  # The biggest silo is the file that has the most lines written by a single user.
  def biggest_silos
    silos.sort_by!(&:lines_for_person).reverse.first(5)
   end

  def silos
    return [] if url.nil?
    if File.directory?(clone_path)
      refresh_repo
    else
      clone_repo
    end
    Dir.chdir(clone_path) do
      files.map do |file_name|
        Silo.new(clone_path, file_name) unless File.zero?(file_name)
      end.compact
    end
  end

  def clone_repo
    `mkdir -p #{REPO_ROOT}; cd #{REPO_ROOT}; mkdir -p #{owner}; cd #{owner}; git clone -q #{url}`
  end

  def refresh_repo
    `cd #{clone_path} && git fetch && git rebase`
  end

  private

  def files
    `git ls-files`.split("\n")
  end

  def clone_path
    File.join(REPO_ROOT, owner, name)
  end
end


# A silo represents a file, along with its top author, number of lines by that author, and total number of lines.
class Silo
  USER_REGEX = /\((?<user>.*)\s*\d{10}\s*[+-]\d{4}\s*\d*\)/

  attr_accessor :dir, :file_name

  def initialize(dir, file_name)
    self.dir = dir
    self.file_name = file_name
  end

  def as_json(options = nil)
    {
      file_name: file_name,
      lines_for_person: lines_for_person,
      person: person,
      total_lines: total_lines,
    }.as_json
  end

  def lines_for_person
    @lines_for_person ||= blames_by_user[person]
  end

  def person
    @person ||= blames_by_user.max_by(&:last).first
  end

  def total_lines
    @total_lines ||= blames.size
  end

  private

  def blame
    Dir.chdir(dir) do
      @blame ||= `git blame #{file_name} -w -t`.encode('UTF-8', invalid: :replace)
    end
  end

  def blames
    blame.split("\n").map { |line| USER_REGEX.match(line)[:user].strip }
  end

  def blames_by_user
    @by_user ||= blames.inject(Hash.new(0)) do |hash, val|
      hash[val] += 1
      hash
    end
  end
end
