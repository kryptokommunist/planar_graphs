// - - - - -
// Graph visualization vodoo script
//
// Copyright (C) 2016 kryptokommunist <marcus.ding[at]student.hpi.de>
// This work is licensed under a GNU style license.
// - - - - -

cytoscape(fullK_N(4,'#k4'));
var k5 = cytoscape(fullK_N(5,'#k5'));
cytoscape(fullK_N(6,'#k6'));
var k2_2 = cytoscape(fullK_N_M(2,2,'#k2_2'));
var k3_3 = cytoscape(fullK_N_M(3,3,'#k3_3'));
cytoscape(fullK_N_M(4,4,'#k4_4'));
cytoscape(dualGraph('#originGraph'));
var dualGraph = cytoscape(dualGraph('#dualGraph'));

function getFormattedGraph(graph, format, id, positions) {

  var layout;

  if(format === 'grid'){
    layout = {
      name: format,
      padding: 10,
      cols: 2
    };
  } else if (format === 'circle') {
    layout = {
      name: format,
      padding: 10};
  } else if (format === 'preset') {
      layout = {
        name: format,
        padding: 10,
        positions: positions
      };
  }

  return {

    container: $(id),
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'background-color': '#B3767E',
          'width': 'mapData(baz, 0, 10, 10, 40)',
          'height': 'mapData(baz, 0, 10, 10, 40)',
          'content': 'data(id)',
        })
      .selector('edge')
        .css({
          'line-color': '#F2B1BA',
          'target-arrow-color': '#F2B1BA',
          'width': 2,
          //'target-arrow-shape': 'circle',
          'opacity': 0.8
        })
      .selector(':selected')
        .css({
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black',
          'opacity': 1
        })
      .selector('.faded')
        .css({
          'opacity': 0.25,
          'text-opacity': 0
        })
        .selector('edge.bezier')
            .css({
              'curve-style': 'unbundled-bezier',
              'control-point-step-size': 40,
              'control-point-distance': '20px',
              'control-point-weight': '0.5'
            })
            .selector('edge.loop')
                .css({
                  'curve-style': 'unbundled-bezier',
                  'control-point-distance': '50',
                  'control-point-weight': '0.5'
                })
            .selector('edge.special')
                .css({
                  'curve-style': 'unbundled-bezier',
                  'control-point-step-size': 40,
                  'control-point-distances': '-50 50',
                  'control-point-weights': '0.8 0.2'
                })
            .selector('node.dual')
                .css({
                  'background-color': 'green',
            })
            .selector('node.helper')
                .css({
                  'background-color': 'rgba(0,0.7,0,1)',
                  'width': 2,
                  'height': 2,
                  'label': ''
            })
            .selector('edge.dual')
                .css({
                  'line-color': 'rgba(0,0.7,0,1)'
            }),

    elements: graph,

    layout: layout,

    ready: function(){
      // ready 1
    }
  };
}

function dualGraph(id) {

  positions = {a: {x: 62, y: 125}, b: {x: 93, y: 62}, c: {x: 124, y: 125}, d: {x: 175, y: 125}, e: {x: 93, y: 187}};

  return getFormattedGraph(make_dualGraph(),'preset',id, positions);

}

function fullK_N(n,id) {
  return getFormattedGraph(makeK_NGraph(n),'circle',id);
}

function fullK_N_M(n,m,id) {
  return getFormattedGraph(makeK_N_MGraph(n,m),'grid',id);
}

function make_dualGraph() {
  var nodes = [];
  nodes.push({ data: { id: 'a', foo: 3, bar: 5, baz: 2, type: 'bezier' } });
  for(var i = 0; i < 4; i++) {
    nodes.push({ data: { id: String.fromCharCode(97 + i + 1), foo: 3, bar: 5, baz: 2 , type: 'bezier' } });
  }

  var edges = [];

  edges.push(getEdge('a','c','bezier'));
  edges.push(getEdge('c','a','bezier'));
  edges.push(getEdge('b','a','bezier'));
  edges.push(getEdge('c','b','bezier'));
  edges.push(getEdge('c','d'));
  edges.push(getEdge('a','e','bezier'));
  edges.push(getEdge('e','c','bezier'));

  return {nodes: nodes, edges: edges};

}

function makeK_N_MGraph(n,m) {

    var nodesA = [];
    var nodesB = [];
    for(var i = 0; i < n; i++) {
      nodesA.push({ data: { id: String.fromCharCode(97 + i), foo: 3, bar: 5, baz: 2 } });
    }
    for(var i = 0; i < m; i++) {
      nodesB.push({ data: { id: String.fromCharCode(97 + n + i), foo: 3, bar: 5, baz: 2 } });
    }



    var nodes = []
    var cnt = 0;
    nodesA.forEach(function(nodeA){
      nodes.push(nodeA);
      nodes.push(nodesB[cnt++]);
    });



    return {nodes: nodes, edges: getFullBipartiteGraphEdges(nodesA, nodesB)};

}

function getEdge(a,b,type) {
  if(type){
    return { data: { id: a + b, weight: 1, source: a, target: b}, classes: type};
  } else {
    return { data: { id: a + b, weight: 1, source: a, target: b}};
  }

}

function makeK_NGraph(n) {

    var nodes = [];
    for(var i = 0; i < n; i++) {
      nodes.push({ data: { id: String.fromCharCode(97 + i), foo: 3, bar: 5, baz: 2 } });
    }

    return {nodes: nodes, edges: getFullGraphEdges(nodes)};

}

function getFullBipartiteGraphEdges(nodesA, nodesB) {
    var edges = [];
    nodesA.forEach(function(selectedNode) {
      nodesB.forEach(function(node) {
            edges.push({ data: { id: selectedNode.data.id + node.data.id, weight: 1, source: selectedNode.data.id, target: node.data.id}});
      });
    });

    return edges;
}

function getFullGraphEdges(nodes) {

    var edges = [];
    var nodesMissingEdges = nodes.slice();
    var newNodes;

    nodes.forEach(function(selectedNode, index, object) {
      nodesMissingEdges.forEach(function(node) {
        if (selectedNode.data.id !== node.data.id) {
            edges.push({ data: { id: selectedNode.data.id + node.data.id, weight: 1, source: selectedNode.data.id, target: node.data.id}});
        }
      })
      nodesMissingEdges.splice(index,1); //remove current selectedNode
    });

    return edges;
}

$('.graph-switcher input').on('change', '',function() {
  activateGraph($(this).attr('data-path'));
});

$('.dual-graph-switcher input').on('change', '',function() {
  activateGraph($(this).attr('data-path'),'.dual-graph','.dual-graph-switcher');
});

function activateGraph(activeId, className = '.full-graph', switchClass = '.graph-switcher') {
  activateGraphButton(activeId, switchClass);
  $(className).addClass('hidden-graph');
  $('#' + activeId).removeClass('hidden-graph');
}

function showPlaneExample() {
  window.scrollTo(0, 0);
  activateGraph('k2_2');
  k2_2.layout({name: 'circle', animate: true, animationDuration: 1000,});
}

function showNonPlaneExample() {
  window.scrollTo(0, 0);
  activateGraph('k2_2');
  k2_2.layout({name: 'grid', animate: true, animationDuration: 1000,});
}

function randomAnimate(callback) {
  k2_2.layout({name: 'random', animate: true, animationDuration: 600, stop: callback});
}

function activateGraphButton(dataPath, className) {
  $(className + ' .btn').removeClass('active');
  $("[data-path='" + dataPath + "']").parent().addClass('active');
}

function showK3_3ProofOne() {
  window.scrollTo(0, 0);
  activateGraph('k3_3');
  highlightEdges(k3_3,"#ad,#bd,#be,#ce,#cf,#af");
  setTimeout(function () {k3_3.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofOne() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdges(k5,"#ab,#cb,#cd,#ed,#ae");
  setTimeout(function () {k5.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofTwo() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdges(k5,"#ce",'yellow');
  setTimeout(function () {k5.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofThree() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdgesSync(k5,"#db,#ac",'green');
  setTimeout(function () {k5.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofFour() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdges(k5,"#ac",'yellow');
  highlightEdges(k5,"#db",'#F2B1BA');
  setTimeout(function () {k5.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofFive() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdgesSync(k5,"#ad,#eb",'green');
  highlightEdgesSync(k5,"#ad,#eb",'red');
  setTimeout(function () {k5.layout({name: 'circle', animate: true, animationDuration: 1000});}, 4700);
}

function showK5ProofSix() {
  window.scrollTo(0, 0);
  activateGraph('k5');
  highlightEdgesSync(k5,"#ac,#eb,#ad",'#F2B1BA');
  highlightEdgesSync(k5,"#ce",'#F2B1BA');
  highlightEdgesSync(k5,"#db",'yellow');
  setTimeout(function () {k5.layout({name: 'circle', startAngle: 19 / 10 * Math.PI, animate: true, animationDuration: 1000});}, 3200);
  highlightEdgesSync(k5,"#ad,#ce",'green');
  highlightEdgesSync(k5,"#ad,#ce",'red');
}

function connectsTargetSource(edge, a,b) {
  return (edge.source() + edge.target());
}

function highlightEdges(graph, selector, col = 'blue') {
  var n = 0;
  graph.edges(selector).forEach(function (edge) {
      edge.delay(n).animate({
                    css: {'line-color': col}
                  },
                  {
                    duration: 1700
                });
      n += 600;
    });
}

function highlightEdgesSync(graph, selector, col = 'blue') {
  var n = 0;
  graph.edges(selector).animate({
                    css: {'line-color': col}
                  },
                  {
                    duration: 1700
                });
}

function showDualExampleOne() {
  activateGraph('dualGraph', '.dual-graph', '.dual-graph-switcher');
  dualGraph.add([
    { group: "nodes", data: { id: "a'" }, position: { x: 93, y: 125 }, classes: 'dual' }
  ]);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "b'" }, position: { x: 93, y: 93 }, classes: 'dual' }
  ]);}, 1000);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "c'" }, position: { x: 195, y: 125 }, classes: 'dual' }
  ]);}, 2000);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "d'" }, position: { x: 93, y: 156 }, classes: 'dual' }
  ]);}, 3000);
}

function showDualExampleTwo() {
  activateGraph('dualGraph', '.dual-graph', '.dual-graph-switcher');
  dualGraph.add([
    { group: "edges", data: { id: "a'b'", source: "a'", target: "b'"} , classes: 'dual' }
  ]);
  setTimeout(function () {dualGraph.add([
    { group: "edges", data: { id: "b'c'", source: "c'", target: "b'" }, classes: 'dual bezier'}
  ]);}, 1000);
  setTimeout(function () {dualGraph.add([
    { group: "edges", data: { id: "a'b'", source: "a'", target: "b'" }, classes: 'dual' }
  ]);}, 2000);
  setTimeout(function () {dualGraph.add([
    { group: "edges", data: { id: "a'd'", source: "a'", target: "d'" }, classes: 'dual' }
  ]);}, 3000);
  setTimeout(function () {dualGraph.add([
    { group: "edges", data: { id: "d'c'", source: "d'", target: "c'" }, classes: 'dual bezier' }
  ]);}, 4000);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "h1" }, position: { x: 159, y: 125 }, classes: 'helper' },
    { group: "edges", data: { id: "c'h1'", source: "c'", target: "h1" }, classes: 'dual loop' },
    { group: "edges", data: { id: "h1c'Ö'", source: "h1", target: "c'" }, classes: 'dual loop' }
  ]);}, 6000);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "h2" }, position: { x: 90, y: 37 }, classes: 'helper' },
    { group: "edges", data: { id: "h1c", source: "h2", target: "b'" }, classes: 'dual loop' },
    { group: "edges", data: { id: "b'h2'", source: "c'", target: "h2" }, classes: 'dual loop' }
  ]);}, 7000);
  setTimeout(function () {dualGraph.add([
    { group: "nodes", data: { id: "h3" }, position: { x: 90, y: 200 }, classes: 'helper' },
    { group: "edges", data: { id: "h3c", source: "d'", target: "h3" }, classes: 'dual loop' },
    { group: "edges", data: { id: "b'h3'", source: "h3", target: "c'" }, classes: 'dual loop' }
  ]);}, 8000);
}
