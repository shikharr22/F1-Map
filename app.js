firebase.initializeApp({
  apiKey: "AIzaSyB8AmIs-Fw5lOTieqhRaEmwjEzw2ebEIxs",

  authDomain: "know-your-f1.firebaseapp.com",

  projectId: "know-your-f1",

  storageBucket: "know-your-f1.appspot.com",

  messagingSenderId: "604859963316",

  appId: "1:604859963316:web:21d696da570a7ddccbc4e1",
});

var db = firebase.firestore();

var intro = document.getElementById("introScreen");

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    intro.style.opacity = 0;
    intro.style.zIndex = 0;
  }, 4000);
});

const map = L.map("map").setView([54.526, 15.2551], 4);

const url =
  "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=hs3S6M6cLXWe5u0OssHP";
const attribution =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
const tileLayer = L.tileLayer(url, { attribution });

tileLayer.addTo(map);
const key = 1;
function generateList() {
  let ul = document.querySelector(".tracks");

  db.collection("Tracks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((track) => {
        const li = document.createElement("li");
        const div = document.createElement("div");
        const a = document.createElement("a");
        const p = document.createElement("p");
        const image = document.createElement("img");
        a.addEventListener("click", () => {
          toTrack(track.data());
          document.getElementById("list").style.display = "none";
          document.getElementById("map").style.width = "100%";
          document.getElementById("driver").style.display = "none";
        });

        div.classList.add("item");
        p.classList.add("trackName");
        a.href = "#";
        p.innerText = track.data().Name;
        image.classList.add("track-image");
        a.appendChild(p);
        a.appendChild(image);
        image.src = track.data().thumbnail;

        div.appendChild(a);

        li.appendChild(div);
        ul.appendChild(li);
      });
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

db.collection("Tracks")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((track) => {
      const layer = L.marker([track.data().Long, track.data().Lat], {
        icon: myMarker,
      }).on("click", () => {
        document.getElementById("left-scroll").style.display = "none";
        document.getElementById("right-scroll").style.display = "none";
        toTrack(track.data());
        document.getElementById("list").style.display = "none";
        document.getElementById("map").style.width = "100%";
      });

      layer.addTo(map);
    });
  });

const toTrack = async (track) => {
  const a = track.Long;
  const b = track.Lat;

  map.flyTo([a, b], 15, { duration: 1 });
  document.getElementById("info").innerHTML = "";
  setTimeout(() => {
    document.getElementById(
      "image"
    ).innerHTML = `<img src=${track.imageUrl} style="position:absolute;top:32px;left:32px;z-index:10000;
    width:250px;height:400px;border-radius:5px;">`;
    var p = document.createElement("p");
    p.classList.add("winner-title");
    p.innerHTML = "WINNERS";
    document.getElementById("info").appendChild(p);
    p.style.fontWeight = "bold";
    p.style.textAlign = "center";

    track.winners.map((winner) => {
      var top_px = 32;
      p = document.createElement("p");
      p.classList.add("winner");
      p.innerHTML = winner;
      p.addEventListener("mouseover", async () => {
        db.collection("Drivers")
          .get()
          .then(async (querySnapshot) => {
            querySnapshot.forEach(async (driver) => {
              let temp = await driver.data().Name;
              if (temp == winner) {
                console.log(temp);
                d = document.createElement("div");
                d.innerHTML = `<img src="./${temp}.jpg" style="position: absolute;
                z-index: 1000;
                right:2vw;
                top:40vh;
                width:250px;
                height:400px;
                border-radius:5px;
                ">`;
                document.getElementById("driver").appendChild(d);
                document.getElementById("driver").style.display = "";
              }
            });
          });
      });

      p.style.top = "top_px+4";
      top_px += 4;
      document.getElementById("info").appendChild(p);
    }, 1000);
  });
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
