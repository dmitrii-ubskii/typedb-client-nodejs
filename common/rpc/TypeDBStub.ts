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


import {ConnectionOpenReq} from "typedb-protocol/proto/connection";
import {
    DatabaseDeleteReq,
    DatabaseManagerAllReq,
    DatabaseManagerAllRes,
    DatabaseManagerContainsReq,
    DatabaseManagerCreateReq,
    DatabaseManagerGetReq,
    DatabaseManagerGetRes,
    DatabaseRuleSchemaReq,
    DatabaseSchemaReq,
    DatabaseTypeSchemaReq
} from "typedb-protocol/proto/database";
import {TypeDBClient as GRPCStub} from "typedb-protocol/proto/service";
import {TypeDBClientError} from "../errors/TypeDBClientError";

/*
TODO implement ResilientCall
 */
export abstract class TypeDBStub {
    connectionOpen(req: ConnectionOpenReq): Promise<void> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().connection_open(req, (err) => {
                    if (err) reject(new TypeDBClientError(err));
                    else resolve();
                })
            })
        );
    }

    databasesCreate(req: DatabaseManagerCreateReq): Promise<void> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().databases_create(req, (err) => {
                    if (err) reject(new TypeDBClientError(err));
                    else resolve();
                })
            })
        );
    }

    databasesContains(req: DatabaseManagerContainsReq): Promise<boolean> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().databases_contains(req, (err, res) => {
                    if (err) reject(new TypeDBClientError(err));
                    else resolve(res.contains);
                });
            })
        );
    }

    databasesGet(req: DatabaseManagerGetReq): Promise<DatabaseManagerGetRes> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().databases_get(req, (err, res) => {
                    if (err) reject(new TypeDBClientError(err));
                    else resolve(res);
                })
            })
        );
    }

    databasesAll(req: DatabaseManagerAllReq): Promise<DatabaseManagerAllRes> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().databases_all(req, (err, res) => {
                    if (err) reject(new TypeDBClientError(err));
                    else resolve(res);
                })
            })
        );
    }

    databaseDelete(req: DatabaseDeleteReq): Promise<void> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                this.stub().database_delete(req, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );
    }

    databaseSchema(req: DatabaseSchemaReq): Promise<string> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                return this.stub().database_schema(req, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.schema);
                });
            })
        );
    }

    databaseTypeSchema(req: DatabaseTypeSchemaReq): Promise<string> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                return this.stub().database_type_schema(req, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.schema);
                });
            })
        );
    }

    databaseRuleSchema(req: DatabaseRuleSchemaReq): Promise<string> {
        return this.mayRenewToken(() =>
            new Promise((resolve, reject) => {
                return this.stub().database_rule_schema(req, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.schema);
                });
            })
        );
    }

    /*
    sessionOpen(openReq: Session.Open.Req): Promise<Session.Open.Res> {
        return new Promise<Session.Open.Res>((resolve, reject) => {
            this.stub().session_open(openReq, (err, res) => {
                if (err) reject(new TypeDBClientError(err));
                else resolve(res);
            });
        });
    }

    sessionClose(req: Session.Close.Req): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.stub().session_close(req, (err, res) => {
                if (err) {
                    console.warn("An error has occurred when issuing session close request: %o", err)
                }
                resolve();
            });
        });
    }

    sessionPulse(pulse: Session.Pulse.Req): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.stub().session_pulse(pulse, (err, res) => {
                if (err) reject(err);
                else {
                    resolve(res.getAlive());
                }
            });
        });
    }

    transaction(): Promise<ClientDuplexStream<common_transaction_pb.Transaction.Client, common_transaction_pb.Transaction.Server>> {
        return new Promise<ClientDuplexStream<common_transaction_pb.Transaction.Client, common_transaction_pb.Transaction.Server>>(
            (resolve, reject) => {
                try {
                    resolve(this.stub().transaction());
                } catch (e) {
                    reject(e);
                }
            });
    }
     */

    abstract stub(): GRPCStub;

    abstract close(): void;

    abstract mayRenewToken<RES>(fn: () => Promise<RES>): Promise<RES>;
}
