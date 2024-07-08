# frozen_string_literal: true

require_relative '../../lib/siwt/message'
require_relative '../../lib/siwt/util'

module DiscourseSiwt
  class AuthController < ::ApplicationController
    def index
    end

    def message
      tezos_account = params[:pkh]
      domain = Discourse.base_url
      domain.slice!("#{Discourse.base_protocol}://")
      message = Siwt::Message.new(domain, tezos_account, Discourse.base_url, "1", {
        issued_at: Time.now.utc.iso8601,
        statement: SiteSetting.discourse_siwt_statement,
        nonce: Siwt::Util.generate_nonce,
        chain_id: params[:chain_id],
      })
      session[:nonce] = message.nonce

      render json: { message: message.pack_message }
    end
  end
end
