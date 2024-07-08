#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

module OmniAuth
  module Strategies
    class Siwt
      include OmniAuth::Strategy

      option :fields, %i[tezos_message tezos_account tezos_signature]
      option :uid_field, :tezos_account

      uid do
        request.params[options.uid_field.to_s]
      end

      info do
        {
          name: request.params[options.uid_field.to_s],
        }
      end

      def request_phase
        query_string = env['QUERY_STRING']
        redirect "/discourse-siwt/auth?#{query_string}"
      end

      def callback_phase
        tezos_message = request.params['tezos_message']
        tezos_signature = request.params['tezos_signature']
        tezos_account = request.params['tezos_account']
        tezos_public_key = request.params['tezos_public_key']
        unpacked_message = ::Siwt::Message.unpack_message(tezos_message)
        siwt_message = ::Siwt::Message.from_message(unpacked_message)

        domain = Discourse.base_url
        domain.slice!("#{Discourse.base_protocol}://")

        if siwt_message.domain != domain
          return fail!("Invalid domain")
        end

        if siwt_message.nonce != session[:nonce]
          return fail!("Invalid nonce")
        end

        failure_reason = nil
        begin
          siwt_message.validate(tezos_signature, tezos_public_key, tezos_message)
        rescue Siwt::ExpiredMessage
          failure_reason = :expired_message
        rescue Siwt::NotValidMessage
          failure_reason = :invalid_message
        rescue Siwt::InvalidSignature
          failure_reason = :invalid_signature
        end

        return fail!(failure_reason) if failure_reason

        super
      end
    end
  end
end
