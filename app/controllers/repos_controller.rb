class ReposController < ApplicationController

  def new
    @repo = Repo.new("A/B")
  end

  def create
    @repo = Repo.new(repo_params)
    if @repo.save
      # redirect_to @repo
      @stats = @repo.stats.sort_by!(&:lines_for_person).reverse.first(5)
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
