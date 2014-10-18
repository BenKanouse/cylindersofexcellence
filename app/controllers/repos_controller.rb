class ReposController < ApplicationController

  def new
    @repo = Repo.new("A/B")
  end

  def create
    @repo = Repo.new(repo_params)
    if @repo.save
      # redirect_to @repo
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
