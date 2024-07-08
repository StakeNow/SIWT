/*
 * SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 * SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
 *
 * SPDX-License-Identifier: MIT
 */
import TezosClient from "../lib/tezos-client";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
  },

  verifySignature(address, publicKey, message, signature) {
    document.getElementById("tezos_account").value = address;
    document.getElementById("tezos_public_key").value = publicKey;
    document.getElementById("tezos_message").value = message;
    document.getElementById("tezos_signature").value = signature;
    document.getElementById("siwt-sign").submit();
  },

  async initAuth() {
    const client = TezosClient.create();
    await client.init();
    const account = await client.requestAccountInfo();
    const { signature, message } = await client.signMessage(account);
    this.verifySignature(
      account.address,
      account.publicKey,
      message,
      signature
    );
  },

  actions: {
    async initAuth() {
      this.initAuth();
    },
  },
});
