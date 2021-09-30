const map = L.map("map").setView([54.526, 15.2551], 4);

const url =
  "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=hs3S6M6cLXWe5u0OssHP";
const attribution =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
const tileLayer = L.tileLayer(url, { attribution });

tileLayer.addTo(map);

function generateList() {
  let ul = document.querySelector(".tracks");
  tracksData.forEach((track) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");
    const image = document.createElement("img");
    a.addEventListener("click", () => {
      toTrack(track);
      document.getElementById("list").style.display = "none";
      document.getElementById("map").style.width = "100%";
    });
    div.classList.add("item");
    p.classList.add("trackName");
    a.href = "#";
    p.innerText = track.properties.name;
    image.classList.add("track-image");
    a.appendChild(p);
    a.appendChild(image);
    image.src = track.properties.thumbnail;
    div.appendChild(a);

    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateList();

var myMarker = L.icon({
  iconUrl: "./marker.png",
  iconSize: [40, 40],
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

const toTrack = async (track) => {
  const a = track.geometry.coordinates[1];
  const b = track.geometry.coordinates[0];

  map.flyTo([a, b], 15, { duration: 1 });

  setTimeout(() => {
    document.getElementById(
      "image"
    ).innerHTML = `<img src=${track.properties.imageUrl} style="position:absolute;top:32px;right:32px;z-index:10000;
    width:250px;height:400px;border-radius:5px;box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);
    -webkit-box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);
    -moz-box-shadow: 0px 5px 8px 1px rgba(255,255,255,0.79);">`;
  }, 1000);

  var response = await fetch(
    `api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&appid=666a220a026f834ea81b0fc12f61a26f`
  );
  var data = response.json();
  console.log(data);
};

document.getElementById("compress").addEventListener("click", () => {
  document.getElementById("list").style.display = "none";
  document.getElementById("map").style.width = "100%";
  document.getElementById("left-scroll").style.display = "none";
  document.getElementById("right-scroll").style.display = "none";
});
document.getElementById("expand").addEventListener("click", () => {
  document.getElementById("list").style.display = "flex";
  document.getElementById("map").style.width = "100vw";
  document.getElementById("left-scroll").style.display = "";
  document.getElementById("right-scroll").style.display = "";
});

const slide = (direction) => {
  var container = document.getElementById("list");
  scrollCompleted = 0;
  var slideVar = setInterval(function () {
    if (direction == "left") {
      container.scrollLeft -= 10;
    } else {
      container.scrollLeft += 10;
    }
    scrollCompleted += 10;
    if (scrollCompleted >= 100) {
      window.clearInterval(slideVar);
    }
  }, 10);
};

document.getElementById("left-scroll").addEventListener("click", (event) => {
  slide("left");
});
document.getElementById("right-scroll").addEventListener("click", (event) => {
  slide("right");
});
