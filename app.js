const map = L.map("map").setView([54.526, 15.2551], 4);

const url =
  "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=hs3S6M6cLXWe5u0OssHP";
const attribution =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>>';
const tileLayer = L.tileLayer(url, { attribution });

tileLayer.addTo(map);
function generateList() {
  let ul = document.querySelector(".tracks");
  tracksData.forEach((track) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");
    a.addEventListener("click", () => {
      toTrack(track);
    });
    div.classList.add("item");
    p.classList.add("trackName");
    a.href = "#";
    p.innerText = track.properties.name;
    a.appendChild(p);
    div.appendChild(a);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateList();

var myMarker = L.icon({
  iconUrl: "./marker.png",
  iconSize: [60, 80],
});

function popupContent(feature) {
  return `<img src=${feature.properties.imageUrl} style="border-radius:5px">`;
}

const trackLayer = L.geoJSON(tracksData, {
  
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, { icon: myMarker }).on("click", () =>
      toTrack(feature)
    );
  },
});



trackLayer.addTo(map);

function toTrack(track) {
  const a=track.geometry.coordinates[1]
  const b=track.geometry.coordinates[0]
  map.flyTo(
    [a,b],
    15,
    { duration: 1 }
  );
  
  setTimeout(()=>{
    document.getElementById('image').innerHTML=`<img src=${track.properties.imageUrl} style="position:absolute;top:32px;right:32px;z-index:10000;
    width:250px;height:400px;border-radius:5px;box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);
    -webkit-box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);
    -moz-box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);">`
  },1000);
  setTimeout(()=>{
    document.getElementById('video').innerHTML=`<video  controls width=480 height=320 autoplay style='position:absolute;top:32px;left:60px;z-index:10000'><source src='${track.properties.videoUrl}' type='video/mp4'></video>`;
  },2000);

}


