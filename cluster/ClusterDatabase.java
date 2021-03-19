/*
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

package grakn.client.cluster;

import grakn.client.api.database.Database;
import grakn.client.core.CoreDatabase;
import grakn.client.core.CoreDatabaseManager;
import grakn.protocol.ClusterDatabaseProto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

class ClusterDatabase implements Database.Cluster {

    private static final Logger LOG = LoggerFactory.getLogger(ClusterDatabase.class);
    private final String name;
    private final Map<String, CoreDatabase> databases;
    private final ClusterDatabaseManager databaseMgr;
    private final Set<Replica> replicas;

    private ClusterDatabase(String database, ClusterDatabaseManager clusterDatabaseMgr) {
        this.name = database;
        this.databaseMgr = clusterDatabaseMgr;
        this.databases = new HashMap<>();
        this.replicas = new HashSet<>();
        for (String address : clusterDatabaseMgr.databaseMgrs().keySet()) {
            CoreDatabaseManager coreDatabaseMgr = clusterDatabaseMgr.databaseMgrs().get(address);
            databases.put(address, new CoreDatabase(coreDatabaseMgr, database));
        }
    }

    static ClusterDatabase of(ClusterDatabaseProto.ClusterDatabase protoDB, ClusterDatabaseManager clusterDatabaseMgr) {
        assert protoDB.getReplicasCount() > 0;
        String database = protoDB.getName();
        ClusterDatabase databaseClusterRPC = new ClusterDatabase(database, clusterDatabaseMgr);
        databaseClusterRPC.replicas().addAll(protoDB.getReplicasList().stream().map(
                rep -> Replica.of(rep, databaseClusterRPC)
        ).collect(toSet()));
        LOG.debug("Discovered database cluster: {}", databaseClusterRPC);
        return databaseClusterRPC;
    }

    @Override
    public String name() {
        return name;
    }

    @Override
    public String schema() {
        // TODO: select the leader database
        return databases.values().iterator().next().schema();
    }

    @Override
    public void delete() {
        for (String address : databases.keySet()) {
            if (databaseMgr.databaseMgrs().get(address).contains(name)) databases.get(address).delete();
        }
    }

    @Override
    public Set<Replica> replicas() {
        return replicas;
    }

    @Override
    public Optional<Replica> primaryReplica() {
        return replicas.stream().filter(Replica::isPrimary).max(Comparator.comparing(Replica::term));
    }

    @Override
    public Replica preferredReplica() {
        return replicas.stream().filter(Replica::isPreferred).findAny()
                .orElse(replicas.iterator().next());
    }

    @Override
    public String toString() {
        return name;
    }

    static class Replica implements Database.Replica {

        private final ID id;
        private final ClusterDatabase database;
        private final boolean isPrimary;
        private final boolean isPreferred;
        private final long term;
        private final int hash;

        private Replica(ClusterDatabase database, String address, boolean isPrimary, boolean isPreferred, long term) {
            this.database = database;
            this.isPrimary = isPrimary;
            this.isPreferred = isPreferred;
            this.term = term;
            this.id = new ID(address, database.name());
            this.hash = Objects.hash(id, isPrimary, isPreferred, term);
        }

        public static Replica of(ClusterDatabaseProto.ClusterDatabase.Replica replica, ClusterDatabase database) {
            return new Replica(database, replica.getAddress(), replica.getPrimary(),
                               replica.getPreferred(), replica.getTerm());
        }

        public ID id() {
            return id;
        }

        @Override
        public Database.Cluster database() {
            return database;
        }

        @Override
        public String address() {
            return id.address;
        }

        @Override
        public boolean isPrimary() {
            return isPrimary;
        }

        @Override
        public boolean isPreferred() {
            return isPreferred;
        }

        @Override
        public long term() {
            return term;
        }

        @Override
        public String toString() {
            return id + ":" + (isPrimary ? "P" : "S") + ":" + term;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Replica replica = (Replica) o;
            return (id == replica.id &&
                    term == replica.term &&
                    isPrimary == replica.isPrimary &&
                    isPreferred == replica.isPreferred);
        }

        @Override
        public int hashCode() {
            return hash;
        }

        static class ID {
            private final String address;
            private final String databaseName;
            private final int hash;

            ID(String address, String databaseName) {
                this.address = address;
                this.databaseName = databaseName;
                this.hash = Objects.hash(address, databaseName);
                ;
            }

            public String address() {
                return address;
            }

            public String databaseName() {
                return databaseName;
            }

            @Override
            public String toString() {
                return address + "/" + databaseName;
            }

            @Override
            public boolean equals(Object o) {
                if (this == o) return true;
                if (o == null || getClass() != o.getClass()) return false;
                ID id = (ID) o;
                return Objects.equals(address, id.address) &&
                        Objects.equals(databaseName, id.databaseName());
            }

            @Override
            public int hashCode() {
                return hash;
            }
        }
    }
}