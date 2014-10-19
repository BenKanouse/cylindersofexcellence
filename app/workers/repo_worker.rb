class RepoWorker
  include Sidekiq::Worker

  def perform(owner_and_name)
    repo = Repo.new(owner_and_name)
    if File.directory?(repo.clone_path)
      repo.refresh_repo
    else
      repo.clone_repo
    end
  end
end
