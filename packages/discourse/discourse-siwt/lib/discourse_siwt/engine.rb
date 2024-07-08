# frozen_string_literal: true

module ::DiscourseSiwt
  PLUGIN_NAME ||= 'discourse-siwt'
  class Engine < ::Rails::Engine
    engine_name PLUGIN_NAME
    isolate_namespace DiscourseSiwt
  end
end
