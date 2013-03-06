class ListsController < ApplicationController
  respond_to :html, :json
  before_filter :find_list, :only => ['show', 'update', 'destroy']

  def index
    @lists = List.order('created_at DESC')
    respond_with(@lists)
  end

  def show
    @list = List.find(params[:id])
    respond_with(@list)
  end

  def create
    @list = List.new(params[:list])
    @list.save
    respond_with(@list)
  end

  def update
    @list.update_attributes(params[:list])
    #respond_with(@list)
    render :json => {:id => @list.id, :name => @list.name }
  end

  def destroy
    @list.destroy
  end

  protected
    def find_list
      @list = List.find(params[:id])
    end
end
