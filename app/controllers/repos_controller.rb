class ReposController < ApplicationController

  def index
    @repo = Repo.new
    @recent_repos = Repo.recent
  end

  def create
    RepoWorker.perform_async(repo_params)
    @repo = Repo.new(repo_params)
    #flash[:notice] = "Loaded data for #{@repo.owner_and_name}"
    render :show
  end

  def show
    @repo = Repo.new(repo_name)
    respond_to do |format|
      format.html
      format.json { render json: @repo.biggest_silos }
    end
  end

  private

  def repo_name
    repo_params = params.permit(:owner, :name)
    repo_name = "#{repo_params[:owner]}/#{repo_params[:name]}"
  end

  def repo_params
    params.require(:repo).require(:owner_and_name)
  end
end
