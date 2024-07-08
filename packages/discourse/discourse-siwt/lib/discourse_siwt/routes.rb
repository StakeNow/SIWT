# frozen_string_literal: true

DiscourseSiwt::Engine.routes.draw do
  get '/auth' => 'auth#index'
  get '/message' => 'auth#message'
end
