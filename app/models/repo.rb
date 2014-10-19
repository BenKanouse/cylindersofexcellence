class Repo
  REPO_ROOT = File.join(Rails.root, "tmp", "repos")

  attr_accessor :owner, :name, :owner_and_name, :url, :user_avatars

  def self.recent
    `mkdir -p #{REPO_ROOT}; cd #{REPO_ROOT} && ls -1trd */* | tail -5`.lines.map(&:chomp).map{|repo| new(repo)}.reverse
    # TODO: Delete repos that are not top 5 that are older than some period of time, to free up disk space.
  end

  def initialize(owner_and_name = nil)
    if owner_and_name
      self.owner_and_name = owner_and_name
      self.url = "https://github.com/#{owner_and_name}.git"
      self.owner = owner_and_name.split('/').first
      self.name = owner_and_name.split('/').last
      # This will work once we fix this error...
      # GET https://api.github.com/repos/railsrumble/r14-team-290/contributors: 403 API rate limit exceeded for 73.38.15.222. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)
      # set_user_avatars
    end
  end

  def save; true; end

  def persisted?; false; end

  def github_repo_exists?
    Faraday.head(url).status == 200 or errors.add(:owner_and_name, "must point to a valid GitHub repo")
  end

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
    `cd #{clone_path} && git fetch && git rebase origin/master`
  end

  private

  def files
    `git ls-files`.split("\n")
  end

  def clone_path
    File.join(REPO_ROOT, owner, name)
  end

  def set_user_avatars
    self.user_avatars = {}
    Github::Client::Repos.new(user: owner, repo: name).contributors.body.each{ |user_body| user_avatars[user_body.login] = user_body.avatar_url }
  end

end


# A silo represents a file, along with its top author, number of lines by that author, and total number of lines.
class Silo
  include ActionView::Helpers::NumberHelper
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
      percent_of_lines: percent_of_lines,
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

  def percent_of_lines
    @percent_of_lines ||= percent_of_lines_by_user
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
    blame.split("\n").map do |line|
      USER_REGEX.match(line) do |match|
        match[:user].strip
      end
    end.compact
  end

  def blames_by_user
    @by_user ||= blames.inject(Hash.new(0)) do |hash, val|
      hash[val] += 1
      hash
    end
  end

  def percent_of_lines_by_user
    number_to_percentage(lines_for_person.to_f / total_lines.to_f * 100, precision: 2)
  end

end
