require(["esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "dojo/domReady!"],

    function
        (Map,
        MapView,
        MapImageLayer,
        FeatureLayer,
        Legend,
        LayerList,
        Search,
        Locator
         ){
        
    //my code starts here

    var mapConfig = {
        basemap: "dark-gray"
    };
    var myMap = new Map(mapConfig);

    var mapView = new MapView({
        map: myMap,
        container: "viewDiv",
        center: [-122.257391, 37.469938],
        zoom: 12
    });

    var dynamic = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer"
    });
    myMap.add(dynamic);

    var fwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#FFAA00",
        width: 4,
        style: "solid"
    };
        // Symbol for U.S. Highways
    var hwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#DF73FF",
        width: 5,
        style: "short-dot"
    };
        // Symbol for other major highways
    var otherSym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#EBEBEB",
        width: 3,
        style: "short-dot"
    };
    var hwyRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        defaultSymbol: otherSym,
        defaultLabel: "Other major roads",
        field: "CLASS",
        uniqueValueInfos: [
            { value: "I", symbol: fwySym, label: "Interstates" },
            { value: "U", symbol: hwySym, label: "US Highways" },
        ]
    };

    hwyRenderer.legendOptions = {
        title: "Classification (high/ow)"

    };


        // POPUP PARTY//

    var measureThisAction = {
        title: "Measure Length",
        id: "measure-this",
        
    };

    var template = { // autocasts as new PopupTemplate()
        title: "Trail run",
        content: "{name}",
        actions: [measureThisAction]
    };


    var myFeatureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
        renderer: hwyRenderer,
        popupTemplate: template
    });

    myMap.add(myFeatureLayer);

        
    var legend = new Legend({
        view: mapView,
        layerInfos: [{ layer: myFeatureLayer, title: 'Life in the Fast Lane' }]
    });

    mapView.ui.add(legend, "bottom-left");

    var layerList = new LayerList({
        view: mapView
    });
        // Adds widget below other elements in the top left corner of the view
    mapView.ui.add(layerList, {
        position: "top-right"
    });
        // search widget
    var searchWidget = new Search({
        view: mapView,

        sources: [{
            locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
            singleLineFieldName: "SingleLine",
            name: "Custom Geocoding Service",
            localSearchOptions: {
                minScale: 300000,
                distance: 50000
            },
            placeholder: "Search Geocoder",
            maxResults: 3,
            maxSuggestions: 6,
            suggestionsEnabled: false,
            minSuggestCharacters: 0
        }, {
            featureLayer: myFeatureLayer,
            searchFields: ["ROUTE_NUM"],
            displayField: "ROUTE_NUM",
            exactMatch: false,
            outFields: ["*"],
            name: "Keep on Searching",
            placeholder: "Example: C18",
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            minSuggestCharacters: 0,

        }, ]
    });
        // Adds the search widget below other elements in
        // the top left corner of the view
    mapView.ui.add(searchWidget, {
        position: "top-right",
        index: 2
    });


  
    });


    //my code ends here
//});