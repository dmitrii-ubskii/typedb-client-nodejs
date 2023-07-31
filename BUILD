#
# Copyright (C) 2022 Vaticle
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

exports_files([
    "pnpm-lock.yaml",
    "package.json",
    "tsconfig.json",
    "package-lock.json",
    "RELEASE_TEMPLATE.md",
    "VERSION",
])

load("@aspect_rules_ts//ts:defs.bzl", "ts_project")
load("@npm//:defs.bzl", "npm_link_all_packages")

npm_link_all_packages(name = "node_modules")

genrule(
    name = "client-nodejs-targz",
    outs = ["client-nodejs.tar.gz"],
    cmd = "tar -cf $(@D)/client-nodejs.tar.gz $(SRCS)",
    srcs = [ "//:client-nodejs" ],
    visibility = ["//visibility:public"],
)

genrule(
    name = "nodejs-ffi",
    outs = ["dist/typedb_client_nodejs.node"],
    srcs = ["@vaticle_typedb_driver_java//rust:typedb_client_nodejs"],
    cmd = "cp $< $@",
    visibility = ["//visibility:public"]
)

ts_project(
    name = "client-nodejs",
    srcs = glob([
        "*.ts",
        "api/**/*.ts",
        "common/**/*.ts",
        "connection/TypeDBClientImpl.ts",
        "connection/TypeDBDatabase*.ts",
        "connection/TypeDBSessionImpl.ts",
    ]),
    assets = [":nodejs-ffi"],
    tsconfig = ":tsconfig.json",
    declaration = True,
    deps = [
        ":node_modules/@types/node",
        ":node_modules/@types/uuid",
        ":node_modules/typedb-protocol",
        ":node_modules/typescript",
        ":node_modules/uuid",
    ],
    visibility = ["//visibility:public"],
    out_dir = "dist",
)
