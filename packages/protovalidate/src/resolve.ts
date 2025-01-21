import {
  type DescField,
  type DescMessage,
  type DescOneof,
  getOption,
  type Registry,
} from "@bufbuild/protobuf";
import {
  field,
  type FieldConstraints,
  message,
  type MessageConstraints,
  oneof,
  type OneofConstraints,
  predefined,
  type PredefinedConstraints,
} from "./gen/buf/validate/validate_pb.js";

export type ConstraintResolver = {
  message(desc: DescMessage): MessageConstraints;
  oneof(desc: DescOneof): OneofConstraints;
  field(desc: DescField): FieldConstraints;
  prefedined(desc: DescField): PredefinedConstraints;
};

// TODO support user-defined shared rules - extensions to any of the buf.validate.*Rules messages
export function createConstraintResolver(
  registry: Registry,
): ConstraintResolver {
  const messages = new Map<DescMessage, MessageConstraints>();
  const oneofs = new Map<DescOneof, OneofConstraints>();
  const fields = new Map<DescField, FieldConstraints>();
  const predefineds = new Map<DescField, PredefinedConstraints>();
  return {
    prefedined(desc) {
      let r = predefineds.get(desc);
      if (!r) {
        predefineds.set(desc, (r = getOption(desc, predefined)));
      }
      return r;
    },
    message(desc) {
      let r = messages.get(desc);
      if (!r) {
        messages.set(desc, (r = getOption(desc, message)));
      }
      return r;
    },
    field(desc) {
      let r = fields.get(desc);
      if (!r) {
        fields.set(desc, (r = getOption(desc, field)));
      }
      return r;
    },
    oneof(desc) {
      let r = oneofs.get(desc);
      if (!r) {
        oneofs.set(desc, (r = getOption(desc, oneof)));
      }
      return r;
    },
  };
}
