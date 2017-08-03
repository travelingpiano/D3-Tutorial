import * as d3 from 'd3';

let svg = d3.select('body').append('svg')
            .attr('width',960)
            .attr('height',960),
diameter = +svg.attr('width'),
g = svg.append('g').attr('transform','translate(2,2)'), //translate to 2, 2 location from default 0,0 location, very minor move
format = d3.format(',d'); //format number with 0 decimal places
let pack = d3.pack().size([diameter - 4, diameter - 4]); //create new d3 circle packing, size sets the size of the pack by width and height

// d3.tsv('data/data1.tsv',(error,root)=>{
//   // console.log(typeof data);
//   if(!root.children){
//     let rootTmp = root;
//     root = {};
//     root.children = rootTmp;
//     console.log(root);
//   }
// });

d3.json('flare.json',(error,root)=>{

  if(error) throw error;

  console.log(root);
  root = d3.hierarchy(root)
           .sum(d=>{
             return d.size; })
           .sort((a,b)=>(b.value-a.value)); //hierarchy, sum and then root acts as a sort method to sort all the child and parent nodes, in this case, from big to small. these needs to be called before
  console.log(root);
  console.log(pack(root).descendants());
  let node = g.selectAll('.node')
              .data(pack(root).descendants())
              .enter().append('g')
              .attr('class',d=> (d.children ? 'node' : 'leaf node'))
              .attr('transform',d=>`translate(${d.x}, ${d.y})`); //move all the nodes to their respective positions
  node.append('title')
      .text(d=>(d.data.name + '\n' + d.value));
  node.append('circle')
      .attr('r',d=>d.r); //creates the circles
  node.filter(d=>!d.children) //only choose leaf nodes
      .append('text')
      .attr('dy','0.3em')
      .html(d=>{
        return d.data.name.substring(0, d.r/3);});
});
