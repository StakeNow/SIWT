#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

# frozen_string_literal: true

require "time"
require "json"
require_relative './exceptions'

SIWT_DOMAIN = "^(?<domain>([^?#]*)) wants you to sign in with your Tezos account:\\n"
SIWT_ADDRESS = "(?<address>tz[a-zA-Z0-9]{34})\\n\\n"
SIWT_STATEMENT = "((?<statement>[^\\n]+)\\n)?\\n"
SIWT_URI = "(([^:?#]+):)?(([^?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))"
SIWT_URI_LINE = "URI: (?<uri>#{SIWT_URI}?)\\n"
SIWT_VERSION = "Version: (?<version>1)\\n"
SIWT_CHAIN_ID = "Chain ID: (?<chain_id>[a-zA-Z0-9]{15})\\n"
SIWT_NONCE = "Nonce: (?<nonce>[a-zA-Z0-9]{8,})\\n"
SIWT_DATETIME = "([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9])"\
                ":([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))"
SIWT_ISSUED_AT = "Issued At: (?<issued_at>#{SIWT_DATETIME})"
SIWT_EXPIRATION_TIME = "(\\nExpiration Time: (?<expiration_time>#{SIWT_DATETIME}))?"
SIWT_NOT_BEFORE = "(\\nNot Before: (?<not_before>#{SIWT_DATETIME}))?"
SIWT_REQUEST_ID = "(\\nRequest ID: (?<request_id>[-._~!$&'()*+,;=:@%a-zA-Z0-9]*))?"
SIWT_RESOURCES = "(\\nResources:(?<resources>(\\n- #{SIWT_URI}?)+))?$"

SIWT_MESSAGE = "#{SIWT_DOMAIN}#{SIWT_ADDRESS}#{SIWT_STATEMENT}#{SIWT_URI_LINE}#{SIWT_VERSION}#{SIWT_CHAIN_ID}"\
               "#{SIWT_NONCE}#{SIWT_ISSUED_AT}#{SIWT_EXPIRATION_TIME}#{SIWT_NOT_BEFORE}#{SIWT_REQUEST_ID}"\
                "#{SIWT_RESOURCES}"

module Siwt
  # Class that defines the EIP-4361 message fields and some utility methods to
  # generate/validate the messages
  class Message
    # RFC 4501 dns authority that is requesting the signing.
    attr_accessor :domain

    # Ethereum address performing the signing conformant to capitalization
    # encoded checksum specified in EIP-55 where applicable.
    attr_accessor :address

    # RFC 3986 URI referring to the resource that is the subject of the signing
    # (as in the __subject__ of a claim).
    attr_accessor :uri

    # Current version of the message.
    attr_accessor :version

    # EIP-155 Chain ID to which the session is bound, and the network where
    # Contract Accounts must be resolved.
    attr_accessor :chain_id

    # Randomized token used to prevent replay attacks, at least 8 alphanumeric
    # characters.
    attr_accessor :nonce

    # ISO 8601 datetime string of the current time.
    attr_accessor :issued_at

    # Human-readable ASCII assertion that the user will sign, and it must not
    # contain `\n`.
    attr_accessor :statement

    # ISO 8601 datetime string that, if present, indicates when the signed
    # authentication message is no longer valid.
    attr_accessor :expiration_time

    # ISO 8601 datetime string that, if present, indicates when the signed
    # authentication message will become valid.
    attr_accessor :not_before

    # System-specific identifier that may be used to uniquely refer to the
    # sign-in request.
    attr_accessor :request_id

    # List of information or references to information the user wishes to have
    # resolved as part of authentication by the relying party. They are
    # expressed as RFC 3986 URIs separated by `\n- `.
    attr_accessor :resources

    def initialize(domain, address, uri, version, options = {})
      @domain = domain
      @uri = uri
      @address = address
      @version = version
      @statement = options.fetch :statement, ""
      @issued_at = options.fetch :issued_at, Time.now.utc.iso8601
      @nonce = options.fetch :nonce, Siwt::Util.generate_nonce
      @chain_id = options.fetch :chain_id, "1"
      @expiration_time = options.fetch :expiration_time, ""
      @not_before = options.fetch :not_before, ""
      @request_id = options.fetch :request_id, ""
      @resources = options.fetch :resources, []
    end

    def self.from_message(msg)
      if (message = msg.match SIWT_MESSAGE)
        domain = message[:domain][23, message[:domain].length - 1]
        new(
          domain,
          message[:address],
          message[:uri],
          message[:version],
          {
            statement: message[:statement] || "",
            issued_at: message[:issued_at],
            nonce: message[:nonce],
            chain_id: message[:chain_id],
            expiration_time: message[:expiration_time] || "",
            not_before: message[:not_before] || "",
            request_id: message[:request_id] || "",
            resources: message[:resources]&.split("\n- ")&.drop(1) || []
          }
        )

      else
        throw "Invalid message input."
      end
    end

    def to_json_string
      obj = {
        domain: @domain,
        address: @address,
        uri: @uri,
        version: @version,
        chain_id: @chain_id,
        nonce: @nonce,
        issued_at: @issued_at,
        statement: @statement,
        expiration_time: @expiration_time,
        not_before: @not_before,
        request_id: @request_id,
        resources: @resources
      }
      obj.to_json
    end

    def self.from_json_string(str)
      obj = JSON.parse str, { symbolize_names: true }
      Siwt::Message.new(
        obj[:domain],
        obj[:address],
        obj[:uri],
        obj[:version], {
          chain_id: obj[:chain_id],
          nonce: obj[:nonce],
          issued_at: obj[:issued_at],
          statement: obj[:statement],
          expiration_time: obj[:expiration_time],
          not_before: obj[:not_before],
          request_id: obj[:request_id],
          resources: obj[:resources]
        }
      )
    end

    def validate(signature, public_key, message)
      raise Siwt::ExpiredMessage if !@expiration_time.empty? && Time.now.utc > Time.parse(@expiration_time)
      raise Siwt::NotValidMessage if !@not_before.empty? && Time.now.utc < Time.parse(@not_before)

      raise Siwt::InvalidSignature if signature.empty?

      raise Siwt::InvalidAddress unless @address.eql?(@address)

      begin
        Siwt::Util.verifySignature(signature, public_key, message)
      rescue StandardError
        raise Siwt::InvalidSignature
      end

      true
    end

    def prepare_message
      greeting = "Tezos Signed Message: \n#{@domain} wants you to sign in with your Tezos account:"
      address = @address
      statement = "\n#{@statement}\n"

      header = [greeting, address]

      if @statement.empty?
        header.push "\n"
      else
        header.push statement
      end

      chain_id = "NetXdQprcVkpaWU"
      chain_id = "NetXnHfVqm9iesp" if @chain_id == "ghostnet"

      header = header.join "\n"

      uri = "URI: #{@uri}"
      version = "Version: #{@version}"
      chain_id = "Chain ID: #{chain_id}"
      nonce = "Nonce: #{@nonce}"
      issued_at = "Issued At: #{@issued_at}"

      body = [uri, version, chain_id, nonce, issued_at]

      expiration_time = "Expiration Time: #{@expiration_time}"
      not_before = "Not Before: #{@not_before}"
      request_id = "Request ID: #{@request_id}"
      resources = "Resources:\n#{@resources.map { |x| "- #{x}" }.join "\n"}"

      body.push expiration_time unless @expiration_time.to_s.strip.empty?

      body.push not_before unless @not_before.to_s.strip.empty?

      body.push request_id unless @request_id.to_s.strip.empty?

      body.push resources unless @resources.empty?

      body = body.join "\n"

      [header, body].join "\n"
    end

    def calculate_length(string)
      l = (string.length / 2).to_s(16).rjust(8, "0")
      l[l.length - 8, l.length]
    end

    def pack_message
      hex = prepare_message.bytes.pack("c*").unpack("H*").first
      ['05', '01', calculate_length(hex), hex].join
    end

    def self.unpack_message(hex)
      hex = hex[12, hex.length]
      [hex].pack("H*").unpack("c*").pack("c*")
    end
  end
end
