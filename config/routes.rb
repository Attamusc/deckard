Deckard::Application.routes.draw do
  root to: "lists#index"

  resources :lists, :only => [:index, :show, :create, :update, :destroy]
end
