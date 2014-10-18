class Repo
  attr_accessor :name, :owner_and_name, :url

  def initialize(owner_and_name)
    self.owner_and_name = owner_and_name
    self.url = "https://github.com/#{owner_and_name}.git"
    self.name = owner_and_name.split('/').last
  end

  def stats
    clone
    Dir.chdir("tmp/#{name}") do
      files.map do |file|
        Stat.new(file) unless File.zero?(file)
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
end

class Stat
  USER_REGEX = /\A.*\(<(?<user>.*)>/

  attr_accessor :file_name

  def initialize(file_name)
    self.file_name = file_name
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

  def blames
    blame = `git blame #{file_name} -w -t -e`.encode('UTF-8', invalid: :replace)
    blame.split("\n").map { |line| USER_REGEX.match(line)[:user] }
  end

  def blames_by_user
    @by_user ||= blames.inject(Hash.new(0)) do |hash, val|
      hash[val] += 1
      hash
    end
  end
end
