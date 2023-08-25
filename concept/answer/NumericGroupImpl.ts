/*
 * Copyright (C) 2022 Vaticle
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {NumericGroup as NumericGroupProto} from "typedb-protocol/proto/answer";
import {Numeric} from "../../api/answer/Numeric";
import {NumericGroup} from "../../api/answer/NumericGroup";
import {Concept} from "../../api/concept/Concept";
import {
    AttributeImpl, AttributeTypeImpl,
    ConceptImpl, EntityImpl, EntityTypeImpl,
    RelationImpl,
    RelationTypeImpl,
    RoleTypeImpl,
    ThingImpl, ThingTypeImpl,
    TypeImpl
} from "../../dependencies_internal";
import {NumericImpl} from "./NumericImpl";
import {ValueImpl} from "../value/ValueImpl";
import {ErrorMessage} from "../../common/errors/ErrorMessage";
import {TypeDBClientError} from "../../common/errors/TypeDBClientError";

export class NumericGroupImpl implements NumericGroup {
    private readonly _owner: Concept;
    private readonly _numeric: Numeric;

    constructor(owner: Concept, numeric: Numeric) {
        this._owner = owner;
        this._numeric = numeric;
    }

    get owner(): Concept {
        return this._owner;
    }

    get numeric(): Numeric {
        return this._numeric;
    }
}

export namespace NumericGroupImpl {
    import BAD_ENCODING = ErrorMessage.Concept.BAD_ENCODING;

    export function of(numericGroupProto: NumericGroupProto) {
        const owner = numericGroupProto.owner;

        let concept: Concept;  // FIXME WET
        if (owner.has_entity_type) concept = EntityTypeImpl.ofEntityTypeProto(owner.entity_type);
        else if (owner.has_relation_type) concept = RelationTypeImpl.ofRelationTypeProto(owner.relation_type);
        else if (owner.has_attribute_type) concept = AttributeTypeImpl.ofAttributeTypeProto(owner.attribute_type);
        else if (owner.has_role_type) concept = RoleTypeImpl.ofRoleTypeProto(owner.role_type);
        else if (owner.has_thing_type_root) concept = ThingTypeImpl.Root.ofThingTypeRootProto(owner.thing_type_root);
        else if (owner.has_entity) concept = EntityImpl.ofEntityProto(owner.entity);
        else if (owner.has_relation) concept = RelationImpl.ofRelationProto(owner.relation);
        else if (owner.has_attribute) concept = AttributeImpl.ofAttributeProto(owner.attribute);
        else if (owner.has_value) concept = ValueImpl.ofValueProto(owner.value);
        else throw new TypeDBClientError(BAD_ENCODING.message(owner));

        return new NumericGroupImpl(concept, NumericImpl.of(numericGroupProto.number))
    }
}