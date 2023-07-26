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
    "package-lock.json",
    "RELEASE_TEMPLATE.md",
    "VERSION",
])

#load("@rules_nodejs//:index.bzl", "pkg_npm", "nodejs_binary")
#load("@vaticle_bazel_distribution//npm:rules.bzl", "assemble_npm", "deploy_npm")
#load("@vaticle_bazel_distribution//github:rules.bzl", "deploy_github")
#load("@vaticle_bazel_distribution//artifact:rules.bzl", "artifact_extractor")
#load("@vaticle_dependencies//tool/checkstyle:rules.bzl", "checkstyle_test")
#load("@vaticle_dependencies//tool/release/deps:rules.bzl", "release_validate_nodejs_deps")
#load("@vaticle_dependencies//distribution:deployment.bzl", "deployment")
#load("//:deployment.bzl", github_deployment = "deployment")

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

filegroup(
    name = "client-nodejs-ts",
    srcs = glob([
        "*.ts",
        "api/**/*.ts",
        "common/**/*.ts",
        "connection/TypeDBClientImpl.ts",
        "connection/TypeDBDatabase*.ts",
#        "concept/**/*.ts",
#        "logic/**/*.ts",
#        "query/**/*.ts",
#        "stream/**/*.ts",
#        "tsconfig.json",
        "node_modules/**"
    ]),
)

behaviour_steps_common = [
    "//test/behaviour/connection:ConnectionStepsBase.ts",
    "//test/behaviour/concept/serialization:SerializationSteps.ts",
    "//test/behaviour/concept/thing:ThingSteps.ts",
    "//test/behaviour/concept/thing/attribute:AttributeSteps.ts",
    "//test/behaviour/concept/thing/entity:EntitySteps.ts",
    "//test/behaviour/concept/thing/relation:RelationSteps.ts",
    "//test/behaviour/concept/type/attributetype:AttributeTypeSteps.ts",
    "//test/behaviour/concept/type/relationtype:RelationTypeSteps.ts",
    "//test/behaviour/concept/type/thingtype:ThingTypeSteps.ts",
    "//test/behaviour/config:Parameters.ts",
    "//test/behaviour/connection/database:DatabaseSteps.ts",
    "//test/behaviour/connection/session:SessionSteps.ts",
    "//test/behaviour/connection/transaction:TransactionSteps.ts",
    "//test/behaviour/typeql:TypeQLSteps.ts",
    "//test/behaviour/util:UtilSteps.ts",
    "//test/behaviour/util:Util.ts",
    "//test:tsconfig.json"
] + glob(["node_modules/**"])

filegroup(
    name = "behaviour-steps-core",
    srcs = behaviour_steps_common + ["//test/behaviour/connection:ConnectionStepsCore.ts"],
    visibility = ["//test/behaviour:__pkg__"],
)

filegroup(
    name = "behaviour-steps-cluster",
    srcs = behaviour_steps_common + [
        "//test/behaviour/connection/user:UserSteps.ts",
        "//test/behaviour/connection:ConnectionStepsCluster.ts"
        ],
    visibility = ["//test/behaviour:__pkg__"],
)

genrule(
    name = "nodejs-ffi",
    outs = ["typedb_client_nodejs.node"],
    srcs = ["@vaticle_typedb_driver_java//rust:typedb_client_nodejs"],
    cmd = "cp $< $@",
    visibility = ["//visibility:public"]
)

ts_project(
    name = "client-nodejs",
    srcs = [":nodejs-ffi"] + glob([
        "*.ts",
        "api/**/*.ts",
        "common/**/*.ts",
        "connection/TypeDBClientImpl.ts",
        "connection/TypeDBDatabase*.ts",
#        "concept/**/*.ts",
#        "logic/**/*.ts",
#        "query/**/*.ts",
#        "stream/**/*.ts",
    ]),
    tsconfig = "tsconfig.json",
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

#pkg_npm(
#    name = "client-nodejs-npm-package",
#    package_name = "typedb-client",
#    srcs = glob([
#       "package.json",
#       "README.md",
#    ]),
#    deps = [
#        "@npm//typedb-protocol",
#        "@npm//@grpc/grpc-js",
#        "@npm//google-protobuf",
#        ":client-nodejs",
#    ],
#    visibility = ["//visibility:public"],
#    vendor_external = [],
#)

#assemble_npm(
#    name = "assemble-npm",
#    target = ":client-nodejs-npm-package",
#)

#deploy_npm(
#    name = "deploy-npm",
#    target = ":assemble-npm",
#    snapshot = deployment["npm.snapshot"],
#    release = deployment["npm.release"],
#)

#deploy_github(
#    name = "deploy-github",
#    release_description = "//:RELEASE_TEMPLATE.md",
#    title = "TypeDB Client Node.js",
#    title_append_version = True,
#    organisation = github_deployment["github.organisation"],
#    repository = github_deployment["github.repository"],
#    draft = False
#)

#NODEJS_TEST_DEPENDENCIES = [
#    ":client-nodejs",
#    "@npm//fs-extra",
#    "@npm//google-protobuf",
#    "@npm//grpc",
#    "@npm//tmp",
#    "@npm//properties-reader",
#]
#
#genrule(
#    name = "typedb-artifact-path",
#    srcs = ["@vaticle_typedb_artifact_mac//file"],
#    outs = ["typedb-artifact-path.txt"],
#    cmd = "echo $(location @vaticle_typedb_artifact_mac//file) > \"$@\"",
#)
#
#artifact_extractor(
#    name = "typedb-extractor",
#    artifact = "@vaticle_typedb_artifact_linux//file",
#)
#
#release_validate_nodejs_deps(
#    name = "release-validate-nodejs-deps",
#    package_json = "//:package.json",
#    tagged_deps = ["typedb-protocol"]
#)
#
#checkstyle_test(
#    name = "checkstyle",
#    include = glob([
#        "*",
#        ".factory/*",
#        "api/**/*.ts",
#        "common/**/*.ts",
#        "concept/**/*.ts",
#        "connection/**/*.ts",
#        "logic/**/*.ts",
#        "query/**/*.ts",
#        "stream/**/*.ts",
#    ]),
#    exclude = glob([
#        "*.json",
#        "*.md",
#        ".bazelversion",
#        ".eslintrc",
#        "LICENSE",
#        "VERSION",
#        "dist/**/*.*",
#    ]),
#    license_type = "apache-header",
#)
#
#checkstyle_test(
#    name = "checkstyle-license",
#    size = "small",
#    include = ["LICENSE"],
#    license_type = "apache-fulltext",
#)
#
## CI targets that are not declared in any BUILD file, but are called externally
#filegroup(
#    name = "ci",
#    data = [
#        "@vaticle_dependencies//tool/bazelrun:rbe",
#        "@vaticle_dependencies//distribution/artifact:create-netrc",
#        "@vaticle_dependencies//tool/release/notes:create",
#    ],
#)
