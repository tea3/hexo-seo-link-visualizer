(function($) {
    let nodes = new vis.DataSet(NODES_DATA);
    let edges = new vis.DataSet(EDGES_DATA);
    const LOCAL_HOST = PREVIEW_HOST || "localhost:4000/";
    let seletctNodeID = "1";
    let initScale;
    let initViewPosition;
    let container = document.getElementById("mynetwork");
    let data = {
        nodes: nodes,
        edges: edges
    };
    const options = {
        nodes: {
            color: {
                border: "rgba(175,225,242,1)",
                background: "rgba(230,252,251,1)",
                highlight: {
                    border: "#373f4a",
                    background: "#576375"
                },
                hover: {
                    border: "#576375",
                    background: "#6f7e95"
                }
            },
            shape: "box",
            size: 15,
            font: {
                color: "rgba(255,255,255,1)",
                face: "Menlo, Consolas, Monaco, Consolas, monospace, arial , sans-serif"
            }
        },
        groups: {
            c1: {
                color: {
                    border: "#a2d5fc",
                    background: "#64ace3"
                }
            },
            c2: {
                color: {
                    border: "#f7b843",
                    background: "#de9610"
                }
            },
            c3: {
                color: {
                    border: "#eba9be",
                    background: "#d06d8c"
                }
            },
            c4: {
                color: {
                    border: "#bfdb6b",
                    background: "#a0c238"
                }
            },
            c5: {
                color: {
                    border: "#b395ba",
                    background: "#9460a0"
                }
            },
            c6: {
                color: {
                    border: "#e36f75",
                    background: "#c93a40"
                }
            },
            c7: {
                color: {
                    border: "#2b93d9",
                    background: "#0074bf"
                }
            },
            c8: {
                color: {
                    border: "#ffe136",
                    background: "#f2cf01"
                }
            },
            c9: {
                color: {
                    border: "#88bf91",
                    background: "#56a764"
                }
            },
            c10: {
                color: {
                    border: "#e57373",
                    background: "#d32f2f"
                }
            },
            c11: {
                color: {
                    border: "#F06292",
                    background: "#C2185B"
                }
            },
            c12: {
                color: {
                    border: "#BA68C8",
                    background: "#7B1FA2"
                }
            },
            c13: {
                color: {
                    border: "#9575CD",
                    background: "#512DA8"
                }
            },
            c14: {
                color: {
                    border: "#7986CB",
                    background: "#303F9F"
                }
            },
            c15: {
                color: {
                    border: "#64B5F6",
                    background: "#1976D2"
                }
            },
            c16: {
                color: {
                    border: "#4FC3F7",
                    background: "#0288D1"
                }
            },
            c17: {
                color: {
                    border: "#4DD0E1",
                    background: "#0097A7"
                }
            },
            c18: {
                color: {
                    border: "#4DB6AC",
                    background: "#00796B"
                }
            },
            c19: {
                color: {
                    border: "#81C784",
                    background: "#388E3C"
                }
            },
            c20: {
                color: {
                    border: "#AED581",
                    background: "#689F38"
                }
            },
            c21: {
                color: {
                    border: "#DCE775",
                    background: "#AFB42B"
                }
            },
            c22: {
                color: {
                    border: "#FFF176",
                    background: "#FBC02D"
                }
            },
            c23: {
                color: {
                    border: "#FFD54F",
                    background: "#FFA000"
                }
            },
            c24: {
                color: {
                    border: "#FFB74D",
                    background: "#F57C00"
                }
            },
            c25: {
                color: {
                    border: "#FF8A65",
                    background: "#E64A19"
                }
            }
        },
        edges: {
            arrows: {
                to: {
                    enabled: true
                }
            },
            smooth: {
                forceDirection: "none"
            }
        },
        interaction: {
            hover: true
        },
        physics: {
            minVelocity: 1
        },
        configure: {
            enabled: false,
            showButton: false
        }
    };
    let dispH = (window.innerHeight ? window.innerHeight : $(window).height()) - 20;
    $("#nt-wrapper").css("height", String(dispH));
    let g_wd = $("#info").width();
    let g_ht = $("#info").height();
    $("#info").css({
        width: g_wd + "px",
        height: g_ht + "px"
    });
    let network = new vis.Network(container, data, options);
    let viewInfo = () => {
        if ($("#info").hasClass("disableInfo")) {
            $("#info").removeClass("disableInfo");
            $("#info").addClass("viewInfo");
        }
    };
    let viewSearch = () => {
        if ($("#searchWindow").hasClass("disableSearch")) {
            $("#searchWindow").removeClass("disableSearch");
            $("#searchWindow").addClass("viewSearch");
        }
    };
    let closeSearchWindow = () => {
        if ($("#searchWindow").hasClass("viewSearch")) {
            $("#searchWindow").removeClass("viewSearch");
            $("#searchWindow").addClass("disableSearch");
        }
    };
    let drawCmp = e => {
        $("#loading").remove();
        getInitViewPosition();
        network.removeEventListener("afterDrawing", drawCmp);
    };
    let searchTitle = () => {
        let keyw = $("#searchBar input").val();
        let k_spl = keyw.replace(/　/g, " ").split(" ");
        let matched = [];
        for (let nd of NODES_DATA) {
            let isMatched = true;
            for (let ks of k_spl) {
                if (nd.tit.toLowerCase().indexOf(ks.toLowerCase()) == -1) {
                    isMatched = false;
                    break;
                }
            }
            if (isMatched) matched.push(nd);
        }
        $("#searchResult ul").remove();
        $("#searchResult").append("<ul></ul>");
        if (matched.length > 0) {
            for (let md of matched) {
                $("#searchResult ul").append(`<li><a href="#" data-id="${md.id}"><div class="srTitle">${md.tit}</div><div class="srSource">${md.source}</div></a></li>`);
            }
        }
    };
    let viewNodeDetail = inNodeID => {
        if (data.nodes.get(inNodeID) && data.nodes.get(inNodeID).tit != null) {
            $("#msg p.title span").html(data.nodes.get(inNodeID).tit);
            $("#msg p.source span.sor").html(data.nodes.get(inNodeID).source);
            $("#msg p.id").html(data.nodes.get(inNodeID).id);
            $("#msg p.source a").attr("href", LOCAL_HOST + data.nodes.get(inNodeID).label);
            if ($("#in ul")[0]) $("#in ul").remove();
            if ($("#out ul")[0]) $("#out ul").remove();
            if ($("#external ul")[0]) $("#external ul").remove();
            if ($("#toc ul")[0]) $("#toc ul").remove();
            $("#in").append("<ul></ul>");
            $("#out").append("<ul></ul>");
            $("#external").append("<ul></ul>");
            $("#toc").append("<ul></ul>");
            for (let ld of links_data) {
                if (ld.id == $("#msg p.id").html()) {
                    $("#cntIn").html(ld.links.int.in.length);
                    $("#cntOut").html(ld.links.int.out.length);
                    $("#cntExt").html(ld.links.ext.length);
                    $("#cntToc").html(ld.links.toc.length);
                    for (let lsi of ld.links.int.in) {
                        $("#in ul").append(`<li><a href="${LOCAL_HOST}${lsi}" target="_blank">${lsi}</a></li>`);
                    }
                    for (let lso of ld.links.int.out) {
                        $("#out ul").append(`<li><a href="${LOCAL_HOST}${lso.replace(/^\//, "")}" target="_blank">${lso}</a></li>`);
                    }
                    for (let lse of ld.links.ext) {
                        $("#external ul").append(`<li><a href="${lse}" target="_blank">${lse}</a></li>`);
                    }
                    for (let lst of ld.links.toc) {
                        $("#toc ul").append(`<li>${lst.replace(/^\#/, "")}</li>`);
                    }
                    break;
                }
            }
            viewInfo();
        }
        if ($("#msg").hasClass("notSelect")) {
            $("#msg").removeClass("notSelect");
            $("#msg").addClass("msgSelect");
        }
    };
    let getInitViewPosition = () => {
        initScale = network.getScale() / 1.2;
        initViewPosition = network.getViewPosition();
    };
    let moveToPosition = (inPos, inScale, inUseOffset) => {
        let offset_x = inUseOffset ? $("#info").innerWidth() * -1 * .5 : 0;
        let offset_y = inUseOffset ? $("#msg").innerHeight() * .5 : 0;
        network.moveTo({
            position: inPos,
            scale: inScale,
            offset: {
                x: offset_x,
                y: offset_y
            },
            animation: {
                duration: 1e3,
                easingFunction: "easeOutCubic"
            }
        });
    };
    let moveToNode = inNodeID => {
        network.selectNodes([ String(inNodeID) ]);
        closeSearchWindow();
        viewNodeDetail(inNodeID);
        let npos = network.getPositions([ String(inNodeID) ]);
        moveToPosition(npos[String(inNodeID)], network.getScale(), true);
    };
    network.addEventListener("afterDrawing", drawCmp);
    network.on("click", e => {
        if (e.nodes.toString()) {
            seletctNodeID = e.nodes.toString();
            viewNodeDetail(seletctNodeID);
        }
    });
    $("#locateBtn").on("click", e => {
        moveToNode(seletctNodeID);
    });
    $("#initPosBtn").on("click", e => {
        moveToPosition(initViewPosition, initScale, true);
    });
    $("#zoomBtn").on("click", e => {
        moveToPosition(network.getViewPosition(), .3, false);
    });
    $("#zoom2Btn").on("click", e => {
        moveToPosition(network.getViewPosition(), .8, false);
    });
    $("#searchBtn").on("click", e => {
        viewSearch();
    });
    $("#searchBar input").on("change", searchTitle);
    $("body").on("click", "#searchWindow li a", e => {
        let sid = $(e.currentTarget).attr("data-id");
        moveToNode(sid);
        seletctNodeID = sid;
    });
    $("#searchWindow").on("click", ".closeWindow", () => {
        closeSearchWindow();
    });
})(jQuery);