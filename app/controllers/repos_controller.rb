class ReposController < ApplicationController

  # Mock out the Repo class for now.
  class Repo < Struct.new(:name)
    def save; true; end
  end

  def new
    @repo = Repo.new
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
    params.require(:name)
  end
end
