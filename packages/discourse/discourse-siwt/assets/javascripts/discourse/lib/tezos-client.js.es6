/*
 * SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 * SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
 *
 * SPDX-License-Identifier: MIT
 */
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import loadScript from "discourse/lib/load-script";

const TezosClient = EmberObject.extend({
  client: null,
  async init() {
    await this.loadScripts();
    if (this.client) {
      return this.client;
    }
    const beacon = window.beacon;
    const client = new beacon.DAppClient({ name: "SIWT" });
    client.subscribeToEvent(
      beacon.BeaconEvent.ACTIVE_ACCOUNT_SET,
      async (account) => {
        if (!account) {
          return;
        }
      }
    );

    this.client = client;
    return this.client;
  },
  async loadScripts() {
    return Promise.all([
      loadScript("/plugins/discourse-siwt/javascripts/beacon.min.js"),
    ]);
  },
  async requestAccountInfo() {
    const activeAccount = await this.client.getActiveAccount();
    if (activeAccount) {
      return activeAccount;
    } else {
      const permissions = await this.client.requestPermissions();
      return permissions.accountInfo;
    }
  },
  async signMessage(account) {
    const {
      address,
      network: { type: network },
    } = account;
    const { message } = await ajax("/discourse-siwt/message", {
      data: {
        pkh: address,
        chain_id: network,
      },
    }).catch(popupAjaxError);

    const { signature } = await this.client.requestSignPayload({
      signingType: "micheline",
      payload: message,
      sourceAddress: address,
    });

    return { signature, message };
  },
});

export default TezosClient;
