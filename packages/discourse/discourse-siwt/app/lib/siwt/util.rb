#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

# frozen_string_literal: true

require "securerandom"
require "ed25519"
require 'digest/blake2b'
require 'rbsecp256k1'
require 'ecdsa'

require_relative "../btc/btcruby"
require_relative "./exceptions"

module Siwt
  # Utilities functions for the Siwt library
  module Util
    module_function

    PK_PREFIX = ['edpk', 'sppk', 'p2pk', 'BLpk']
    SIG_PREFIX = ['edsig', 'p2sig', 'spsig', 'sig']
    PREFIX = PK_PREFIX + SIG_PREFIX

    def generate_nonce
      SecureRandom.alphanumeric(16)
    end

    def extractPKPrefix(pk)
      pk[0..3]
    end

    def extractSigPrefix(signature)
      signature.start_with?("sig") ? signature[0..2] : signature[0..4]
    end

    def hex_to_array(hex)
      if hex.length % 2 != 0
        raise "Invalid hex string"
      end

      hex.scan(/../).map { |x| Integer(x, 16)}
    end

    def verifySignature(signature, public_key, message)
      validatePublicKey(public_key)
      validateSignature(signature)

      pkPrefix = extractPKPrefix(public_key)
      sigPrefix = extractSigPrefix(signature)

      decodedPK = BTC::Base58.data_from_base58check(public_key).unpack("H*").first.slice((pkPrefix.length * 2)..-1)
      decodedSig = BTC::Base58.data_from_base58check(signature).unpack("H*").first.slice((sigPrefix.length * 2)..-1)
      digest = Digest::Blake2b.hex(hex_to_array(message).pack("C*"))

      if pkPrefix == "edpk"
        p "EDPK"
        verify_key = Ed25519::VerifyKey.new([decodedPK].pack("H*"))
        signature = [decodedSig].pack("H*")
        raise SIWT::InvalidSignature unless verify_key.verify(signature, [digest].pack("H*"))
      end

      if pkPrefix == "sppk"
        p "SPPK"
        context = Secp256k1::Context.create
        sig = Secp256k1::Signature.from_compact([decodedSig].pack("H*"))
        pub_key = Secp256k1::PublicKey.from_data([decodedPK].pack("H*"))
        raise SIWT::InvalidSignature unless context.verify(sig, pub_key, [digest].pack("H*"))

        # ECDSA VERIFY
        # group = ECDSA::Group::Secp256k1
        # ecdsa_public_key = ECDSA::Format::PointOctetString.decode([decodedPK].pack("H*"), group)
        
        # hex_regex = /([a-f\d]{64})/i
        # matches = decodedSig.scan(hex_regex)
        # sig = ECDSA::Signature.new Integer(matches[0][0], 16), Integer(matches[1][0], 16)
        # valid = ECDSA.valid_signature?(ecdsa_public_key, [digest].pack("H*"), sig)
      end

      if pkPrefix == "p2pk"
        p "P2PK"
        group = ECDSA::Group::Secp256r1
        ecdsa_public_key = ECDSA::Format::PointOctetString.decode([decodedPK].pack("H*"), group)
        decodedSig = BTC::Base58.data_from_base58check(signature).unpack("H*").first.slice(((sigPrefix.length - 1) * 2)..-1)
        hex_regex = /([a-f\d]{64})/i
        matches = decodedSig.scan(hex_regex)
        sig = ECDSA::Signature.new Integer(matches[0][0], 16), Integer(matches[1][0], 16)
        valid = ECDSA.valid_signature?(ecdsa_public_key, [digest].pack("H*"), sig)
        raise SIWT::InvalidSignature unless valid
        p "ECDSA VERIFY: #{valid}"
      end
    end

    def validatePublicKey(public_key)
      validatePrefixedValue(public_key, PK_PREFIX)
    end

    def validateSignature(signature)
      validatePrefixedValue(signature, SIG_PREFIX)
    end

    def validatePrefixedValue(value, prefixes)
      pattern = /#{prefixes.join("|")}/
      match = pattern.match(value)

      if !match || match.nil?
        return false
      end

      if !PREFIX.include?(match[0])
        return false
      end

      BTC::Base58.data_from_base58check(value)
    end
  end
end
