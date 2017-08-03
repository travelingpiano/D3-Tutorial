import * as d3 from 'd3';

let svg = d3.select('svg'),
diameter = +svg.attr('width'),
g = svg.append('g').attr('transform','translate(2,2)'), //translate to 2, 2 location from default 0,0 location
format = d3.format(',d'); //format number with 0 decimal places

let pack = d3.pack().size([diameter - 4, diameter - 4]); //create new d3 circle packing, size sets the size of the pack by width and height

d3.json('flare.json',(error,root)=>{
  if(error) throw error;
  console.log(root);
  // root = d3.hierarchy(root)
  //          .sum(d=>{
  //            return d.size; })
  //          .sort((a,b)=>(b.value-a.value)); //hierarchy, sum and then root acts as a sort method to sort all the child and parent nodes, in this case, from big to small
  console.log(root);
  console.log(pack(root));
  let node = g.selectAll('.node')
              .data(pack(root).descendants())
              .enter().append('g')
              .attr('class',d=> (d.children ? 'node' : 'leaf node'))
              .attr('transform',d=>`translate(${d.x}, ${d.y})`);
});
