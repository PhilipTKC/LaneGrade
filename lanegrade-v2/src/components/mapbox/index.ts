import { IPlatform } from "@aurelia/kernel";
import { bindable, customElement, ICustomElementViewModel } from "aurelia";

import { MongoFrame } from "common/interfaces";

import { Loader } from "@googlemaps/js-api-loader";
import { wktToGeoJSON } from "@terraformer/wkt";

import { observable } from "@aurelia/runtime";
import template from "./index.html";

@customElement({ name: "mapbox", template })
export class MapBoxCustomElement implements ICustomElementViewModel {
  @bindable frame: MongoFrame;

  private map: google.maps.Map;

  private defectPolygon: google.maps.Polygon;

  private mapMarker: google.maps.Marker;

  private mapIds = [
    { value: "satellite", name: "Satellite" },
    { value: "roadmap", name: "Road Map" },
  ];

  @bindable private selectedMapId = "satellite";

  constructor(@IPlatform private readonly platform: IPlatform) {}

  attached(): void {
    const loader = new Loader({
      apiKey: "AIzaSyCs_SwQOHv13AxErN6syz5uhAxC_VI04Gg",
      version: "weekly",
    });

    const satelliteOptions = {
      zoom: 20,
      mapTypeId: "satellite",
      disableDefaultUI: true,
    };

    this.platform.taskQueue.queueTask(async () => {
      loader.load().then(() => {
        const center = new google.maps.LatLng(Number(this.frame.lat), Number(this.frame.long));

        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          ...satelliteOptions,
          center,
        });

        this.setPolygon(this.frame);

        this.setMapPin(this.frame);
        this.mapMarker.setVisible(false);
      });
    });
  }

  frameChanged(newFrame: MongoFrame): void {
    if (!newFrame) {
      return;
    }

    if (this.selectedMapId === "satellite") {
      this.defectPolygon.setMap(null);
      this.setPolygon(newFrame);

      this.setMapPin(newFrame);
      this.mapMarker.setVisible(false);
    }

    if (this.selectedMapId === "roadmap") {
      this.mapMarker.setMap(null);
      this.setMapPin(newFrame);

      this.setPolygon(newFrame);
      this.defectPolygon.setVisible(false);
    }
  }

  setPolygon(frame: MongoFrame): void {
    const center = new google.maps.LatLng(Number(frame.lat), Number(frame.long));
    this.map.setCenter(center);

    const polygon = wktToGeoJSON(frame.wkt);

    const mapped = polygon.coordinates.map((x) => x.map((y) => ({
      lat: y[1],
      lng: y[0],
    })));

    this.defectPolygon = new google.maps.Polygon({
      paths: mapped,
      strokeColor: "#FF0000",
      strokeOpacity: 0.45,
      strokeWeight: 1.5,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
    });

    this.defectPolygon.setMap(this.map);
  }

  setMapPin(frame: MongoFrame): void {
    const marker = new google.maps.LatLng(Number(frame.lat), Number(frame.long));

    this.map.setCenter(marker);

    this.mapMarker = new google.maps.Marker({
      position: marker,
      map: this.map,
    });
  }

  selectedMapIdChanged(id: string): void {
    if (typeof google === "object" && typeof google.maps === "object") {
      this.map.setMapTypeId(id);

      if (id === "satellite") {
        this.defectPolygon.setVisible(true);
        this.mapMarker.setVisible(false);
        this.map.setZoom(20);
      }

      if (id === "roadmap") {
        this.defectPolygon.setVisible(false);
        this.mapMarker.setVisible(true);
        this.map.setZoom(16);
        this.map.setOptions({
          styles: [
            {
              featureType: "administrative",
              elementType: "labels",
              stylers: [
                { visibility: "off" },
              ],
            }, {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                { visibility: "off" },
              ],
            }, {
              featureType: "water",
              elementType: "labels",
              stylers: [
                { visibility: "off" },
              ],
            }, {
              featureType: "road",
              elementType: "labels",
              stylers: [
                { visibility: "on" },
              ],
            },
          ],
        });
      }
    }
  }
}
