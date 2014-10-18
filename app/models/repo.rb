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

  attr_accessor :file_name, :person, :lines_for_person, :total_lines

  def initialize(file_name)
    self.file_name = file_name
    summarize_blame
  end

  def blame_file
    `git blame #{file_name} -w -t -e`.encode('UTF-8', invalid: :replace)
  end

  def summarize_blame
    blame_array = blame_file.split("\n")
    user_array = blame_array.map { |line| USER_REGEX.match(line)[:user] }
    by_user = user_array.inject(Hash.new(0)) do |hash, val|
      hash[val] += 1
      hash
    end
    self.person = by_user.max_by(&:last).first
    self.lines_for_person = by_user[person]
    self.total_lines = blame_array.size
  end
end
