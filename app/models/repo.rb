class Repo
  attr_accessor :name, :owner_and_name, :url

  def initialize(owner_and_name)
    self.owner_and_name = owner_and_name
    self.url = "https://github.com/#{owner_and_name}.git"
    self.name = owner_and_name.split('/').last
  end

  def save; true; end

  def stats
    clone
    Dir.chdir(clone_path) do
      files.map do |file_name|
        Stat.new(clone_path, file_name) unless File.zero?(file_name)
      end.compact
    end
  end

  def clone
    `cd tmp && git clone #{url}`
  end

  private

  def files
    `git ls-files`.split("\n")
  end

  def clone_path
    "tmp/#{name}"
  end
end

class Stat
  USER_REGEX = /\A.*\(<(?<user>.*)>/

  attr_accessor :dir, :file_name

  def initialize(dir, file_name)
    self.dir = dir
    self.file_name = file_name
  end

  def to_json
    {
      file_name: file_name,
      lines_for_person: lines_for_person,
      person: person,
      total_lines: total_lines,
    }.to_json
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
      @blame ||= `git blame #{file_name} -w -t -e`.encode('UTF-8', invalid: :replace)
    end
  end

  def blames
    blame.split("\n").map { |line| USER_REGEX.match(line)[:user] }
  end

  def blames_by_user
    @by_user ||= blames.inject(Hash.new(0)) do |hash, val|
      hash[val] += 1
      hash
    end
  end
end
