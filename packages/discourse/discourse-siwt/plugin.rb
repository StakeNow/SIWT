#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

# frozen_string_literal: true

# name: discourse-siwt
# about: A discourse plugin to enable users to authenticate via Sign In with Tezos
# version: 0.0.1
# author: siwt
# url: https://siwt.xyz
# required_version: 2.7.0

enabled_site_setting :discourse_siwt_enabled
register_asset 'stylesheets/discourse-siwt.scss'

%w[
  ../lib/omniauth/strategies/siwt.rb
].each { |path| load File.expand_path(path, __FILE__) }

gem 'pkg-config', '1.5.0', require: false
gem 'forwardable', '1.3.3', require: false
gem 'mkmfmf', '0.4', require: false
gem 'mini_portile2', '2.8.0', require: false
gem 'rbsecp256k1', '6.0.0', require: false
gem 'konstructor', '1.0.2', require: false
gem 'ffi', '1.17.0', require: false
gem 'ffi-compiler', '1.0.1', require: false
gem 'ecdsa', '1.2.0', require: false
gem 'base58', '0.2.3', require: false
gem 'ed25519', '1.3.0', require: false
gem 'digest-blake2b', '0.0.5', require: false

class ::SiwtAuthenticator < ::Auth::ManagedAuthenticator
  def name
    'siwt'
  end

  def register_middleware(omniauth)
    omniauth.provider :siwt,
                      setup: lambda { |env|
                        strategy = env['omniauth.strategy']
                      }
  end

  def enabled?
    SiteSetting.discourse_siwt_enabled
  end

  def primary_email_verified?
    false
  end
end

auth_provider authenticator: ::SiwtAuthenticator.new,
              icon: 'user'

after_initialize do
  %w[
    ../lib/discourse_siwt/engine.rb
    ../lib/discourse_siwt/routes.rb
    ../app/controllers/discourse_siwt/auth_controller.rb
  ].each { |path| load File.expand_path(path, __FILE__) }

  Discourse::Application.routes.prepend do
    mount ::DiscourseSiwt::Engine, at: '/discourse-siwt'
  end
end
