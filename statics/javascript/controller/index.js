/**
 * Created by XadillaX on 2014/6/14.
 */
var indexController = function($scope) {
    $scope.list = [ ];

    function refreshList() {
        $.get("/api/list", function(e) {
            if(!e.status) {
                return;
            }

            $scope.list = e.list;
            $scope.$apply();
            $scope.flashMsg();
        });
    }

    // ... init list...
    refreshList();
    setInterval(refreshList, 10000);

    /**
     * flash msg.
     */
    $scope.flashMsg = function() {
        for(var i = 0; i < $scope.list.length; i++) {
            if($scope.list[i].flashMsg) {
                alert($scope.list[i].flashMsg);
            }
        }
    };

    /**
     * delete a tunnel...
     * @param tunnelId
     */
    $scope.delTunnel = function(tunnelId) {
        vex.dialog.confirm({
            message         : "Are you sure to delete this tunnel?",
            callback        : function(val) {
                if(val === false) return;

                $.post("/api/delete", { tunnelId: tunnelId }, function(e) {
                    if(!e.status) {
                        alert(e.msg);
                    }

                    $scope.list = e.list;
                    $scope.$apply();
                    $scope.flashMsg();
                })
            }
        });
    };

    /**
     * connect...
     * @param tunnelId
     */
    $scope.tunnelAction = function(tunnelId) {
        for(var i = 0; i < $scope.list.length; i++) {
            if($scope.list[i].tunnelId.toString() === tunnelId.toString()) {
                //console.log(tunnelId);
                $.post("/api/" + ($scope.list[i].connected ? "disconnect" : "connect"), {
                    tunnelId        : tunnelId
                }, function(e) {
                    if(!e.status) {
                        alert(e.msg);
                    }

                    $scope.list = e.list;
                    $scope.$apply();
                    $scope.flashMsg();
                });
            }
        }
    };

    /**
     * 添加隧道（输入框按下回车
     * @param $event
     */
    $scope.addTunnelPre = function($event) {
        if($event.keyCode !== 13) return;
        this.addTunnel(this.remoteHost, this.remotePort, this.localPort, this.username, this.pkfilename);
    };

    /**
     * 添加隧道
     * @param remoteHost
     * @param remotePort
     * @param localPort
     * @param username
     * @param pkfilename
     */
    $scope.addTunnel = function(remoteHost, remotePort, localPort, username, pkfilename) {
        if(!remoteHost || !remotePort || !localPort || !username) {
            alert("Please fill the blanks.");
            return;
        }

        // post
        $.post("/api/add-tunnel", {
            host        : remoteHost,
            remotePort  : remotePort,
            localPort   : localPort,
            username    : username,
            pkfilename  : pkfilename
        }, function(e) {
            if(!e.status) {
                alert(e.msg);
            } else {
                // ...
                $scope.remoteHost = "";
                $scope.remotePort = "";
                $scope.localPort = "";
                $scope.username = "";
                $scope.pkfilename = "";

                $scope.list = e.list;
                $scope.$apply();
                $scope.flashMsg();
            }
        });
    };
};
