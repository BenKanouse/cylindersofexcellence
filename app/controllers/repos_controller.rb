class ReposController < ApplicationController

  def index
    @new_repo = Repo.new
    @recent_repos = Repo.recent
  end

  def create
    @repo = Repo.new(repo_params)
    if @repo.save
      flash[:notice] = "Loaded data for #{@repo.owner_and_name}"
      render :show
    else
      render :new
    end
  end

  private

  def repo_params
    params.require(:repo).require(:name)
  end
end
