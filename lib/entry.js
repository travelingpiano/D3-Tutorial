import * as d3 from 'd3';



// d3.tsv('data/data1.tsv',(error,root)=>{
//   // console.log(typeof data);
//   if(!root.children){
//     let rootTmp = root;
//     root = {};
//     root.children = rootTmp;
//     console.log(root);
//   }
// });
document.addEventListener('DOMContentLoaded',()=>{
  createCirclePack();});


let createCirclePack = ()=>{
  d3.json('flare.json',(error,root)=>{
    d3.selectAll('.chart > *').remove();
    let body = d3.select('.chart');
    let width = Number(body.style('width').slice(0,-2));
    let height = Number(body.style('height').slice(0,-2));
    let svg = body.append('svg').attr('class','chart')
                .attr('width',width)
                .attr('height',height),
    margin = 20;
    let diameter;
    if(width> height){
      diameter = +svg.attr('height');
    }else{
      diameter = +svg.attr('width');
    }
    console.log(diameter);
    console.log(height);
    console.log(width);
    let g = svg.append('g').attr('transform',`translate(${diameter/2},${diameter/2})`), //translate to 2, 2 location from default 0,0 location, very minor move
    format = d3.format(',d'); //format number with 0 decimal places
    let pack = d3.pack().size([diameter - margin, diameter - margin]).padding(2); //create new d3 circle packing, size sets the size of the pack by width and height
    if(error) throw error;
    root = d3.hierarchy(root)
             .sum(d=>{
               return d.size; })
             .sort((a,b)=>(b.value-a.value)); //hierarchy, sum and then root acts as a sort method to sort all the child and parent nodes, in this case, from big to small. these needs to be called before
    let color = d3.scaleLinear()
                  .domain([-1, 5])
                  .range(['hsl(152,80%,80%)', 'hsl(228, 30%, 40%)'])
                  .interpolate(d3.interpolateHcl);
    let focus = root,
        nodes = pack(root).descendants(),
        view;
    let circle = g.selectAll("circle")
                  .data(nodes)
                  .enter().append('circle')
                  .attr('class',d=>d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root')
                  .attr('fill', d=> d.children ? color(d.depth) : null)
                  .on('click', d=> {
                    if(focus !== d){
                      zoom(d);
                      d3.event.stopPropagation();
                    }
                  });
    let text = g.selectAll('text')
                .data(nodes)
                .enter().append('text')
                .attr('class','label')
                .attr('fill-opacity',d=> d.parent===root ? 1:0)
                .attr('display', d => d.parent === root ? 'inline' : 'none')
                .text(d=> {
                  return d.data.name;});
    let node = g.selectAll('circle,text');
    svg.style('background',color(-1))
       .on('click',()=>{zoom(root);});
    zoomTo([root.x, root.y, root.r*2+margin]);

    let zoom = (d) => {
      let focus0 = focus;
      console.log(d);
      if(!d.children){
        focus = d.parent;
      }else{
        focus = d;
      }
      let transition = d3.transition()
                         .duration(d3.event.altKey ? 7500 : 750)
                         .tween('zoom', function(d){
                           console.log(view);
                           console.log(focus);
                           let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r*2+margin]);
                           return t => {zoomTo(i(t));};
                         })
      transition.selectAll('text')
                .filter(function(d){
                  return d.parent === focus || this.style.display === 'inline';})
                .style('fill-opacity', function(d){return d.parent===focus ? 1:0;})
                .on('start',function(d){
                  if(d.parent === focus){

                    this.style.display = 'inline';
                  }
                }).on('end', function(d){
                  if(d.parent !== focus){
                    this.style.display = 'none';
                  }
                });
    };

    function zoomTo(v) {
      let k = diameter / v[2];
      view = v;

      node.attr('transform',d=> `translate( ${(d.x - v[0])*k}, ${(d.y - v[1])*k})`);
      circle.attr('r', d=> d.r*k);
    }
  });
};


window.addEventListener('resize',createCirclePack);

//static circle packing
// let node = g.selectAll('.node')
//             .data(pack(root).descendants())
//             .enter().append('g')
//             .attr('class',d=> (d.children ? 'node' : 'leaf node'))
//             .attr('transform',d=>`translate(${d.x}, ${d.y})`); //move all the nodes to their respective positions
// node.append('title')
//     .text(d=>(d.data.name + '\n' + d.value));
// node.append('circle')
//     .attr('r',d=>d.r); //creates the circles
// node.filter(d=>!d.children) //only choose leaf nodes
//     .append('text')
//     .attr('dy','0.3em')
//     .html(d=>{
//       return d.data.name.substring(0, d.r/3);});
