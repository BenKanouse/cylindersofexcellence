class ReposController < ApplicationController

  def index
    @repo = Repo.new
    @recent_repos = Repo.recent
  end

  def create
    @repo = Repo.new(repo_params)
    if @repo.save
      flash[:notice] = "Loaded data for #{@repo.owner_and_name}"
      render :show
    else
      render :index
    end
  end

  def show
    @repo = Repo.new(repo_params)
  end

  private

  def repo_params
    params.require(:repo).require(:owner_and_name)
  end
end
