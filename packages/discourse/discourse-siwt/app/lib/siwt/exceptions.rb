#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

# frozen_string_literal: true

module Siwt
  # Used when the message is already expired. (Expires At < Time.now)
  class ExpiredMessage < StandardError
    def initialize(msg = "Message expired.")
      super
    end
  end

  # Used when the message is not yet valid. (Not Before > Time.now)
  class NotValidMessage < StandardError
    def initialize(msg = "Message not yet valid.")
      super
    end
  end

  # Used when the signature doesn't correspond to the address of the message.
  class InvalidSignature < StandardError
    def initialize(msg = "Signature doesn't match message.")
      super
    end
  end
end
