(function (){
    "use strict";
    /*jslint browser: true*/
    /*global L, console*/

    /**
     * A Leaflet control for showing one or more legends. Each legend contains
     * a colorbar, parameter name and units, source/attribution, and optionally
     * information about when the data was last updated.
     */
    L.Control.Legend = L.Control.extend({
        options: {
            position: "bottomleft",
            language: "en",
            timezone: 'local',
            collapsedInfo: null
        },
            
        legendOptions: {},

        initialize: function(options) {
            L.Util.setOptions(this, options);
            this._map = null;
            if (this.options.collapsedInfo === null) {
                this.options.collapsedInfo = true;
                if (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined") {
                    var mq = window.matchMedia('screen and (orientation: landscape) and (min-width: 641px) and (min-height: 481px), screen and (orientation: portrait) and (min-width: 481px) and (min-height: 641px)');
                    if (mq.matches) {
                        this.options.collapsedInfo = false;
                    }
                }
            }
            this._container = L.DomUtil.create('div', 'fcoo-legend-container');
            this._container.style.display = 'none';
            this._legendCounter = 0;
        },

        onAdd: function(map) {
            var that = this;
            // Whenever the timezone is changed we will change the internal timezone
            map.on("timezonechange", function(data) {
                that.options.timezone = data.timezone;
                that._redrawLegend();
            });
            return this._container;
        },

        addLegend: function(legendOptions) {
            var legendId = this._legendCounter++;
            this.legendOptions[legendId] = legendOptions;
            this._redrawLegend();
            this._container.style.display = 'block';
            return legendId;
        },

        removeLegend: function(legendId) {
            if (typeof this.legendOptions[legendId] != 'undefined') {
                delete this.legendOptions[legendId];
            }
            // reset counter if no legend is in collection
            var containerEmpty = true;
            for (var idx in this.legendOptions) {
                containerEmpty = false;
                break;
            }
            if (containerEmpty) {
                this.legendOptions = {};
                this._container.style.display = 'none';
            }
            this._redrawLegend();
        },

        _redrawLegend: function() {
            var that = this;
            this._container.innerHTML = ''; // clear container
            //var containerInner = L.DomUtil.create('div', 'fcoo-legend-container', this._container);
            //var btn_min = L.DomUtil.create('div', 'fcoo-legend-container-btn-minimize', this._container);
            //btn_min.innerHTML = '-';
            //$(this._container).append('<div>New content</div>');
            //('div', 'fcoo-legend-container-btn-minimize');
            //.fcoo-legend-item-btn-minimize
            var isLeft = this.options.position.indexOf('left') !== -1;
            var cssFloat = isLeft ? 'left' : 'right';
            var lang = this.options.language;
            $.each(this.legendOptions, function(idx, options) {
                var imgUrl = options.imageUrl;
                var attribution = options.attribution;
                var lastUpdated = options.lastUpdated;
                var updatesPerDay = options.updatesPerDay;
                var epoch = options.epoch;
                var longName = options.longName;
                var units = options.units;
                units = that._(units, lang);
                var item = L.DomUtil.create('div', 'fcoo-legend-item', that._container);
                item.style.cssFloat = cssFloat;
                var itemMainSpan = L.DomUtil.create('span', '', item)
                var itemDiv = L.DomUtil.create('div', 'fcoo-legend-item-div', itemMainSpan);
                var item_img = L.DomUtil.create('img', 'fcoo-legend-item-image', itemDiv);
                item_img.src = imgUrl;

                var leginner = '';
                var item_text = L.DomUtil.create('div', 'fcoo-legend-item-text', itemMainSpan);

                var lnameP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text);
                var btn = L.DomUtil.create('i', 'fa-caret-square-o-down fa fcoo-legend-item-compress', lnameP);
                btn.innerHTML = '&nbsp;&nbsp;';
                if (longName !== undefined) {
                    var longNameCap =
                        longName.charAt(0).toUpperCase() +
                        longName.slice(1);
                    longNameCap = that._(longNameCap, lang);
                    //var lnameP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text);
                    if (units !== undefined && units !== '') {
                        longNameCap = longNameCap + ' [' + units + ']';
                    }
                    var lspan = L.DomUtil.create('span', '', lnameP);
                    lspan.innerHTML = longNameCap;
                }
                //var btnDiv = L.DomUtil.create('div', 'fcoo-legend-item-hide', btn);

                var item_text_extra = L.DomUtil.create('div', 'fcoo-legend-item-text', item);
                if (attribution !== undefined) {
                    var source = that._('Source', lang) + ': ' + attribution;
                    var attrP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text_extra);
                    attrP.innerHTML = source;
                }

                // Date formatter
                var dateAsHTML = function( m, language, tz ){
                    var dateFormat = 'DD-MMM-YY HH:mm',
                        localTxt = language == 'da' ? 'lokal' : 'local',
                        result;
                    if (tz == 'local') {
                        result = m.local().format(dateFormat)+ '&nbsp;('+localTxt+')';
                    } else {
                        result = m.utc().format(dateFormat) + '&nbsp;(UTC)';
                    }
                    return result;
                };

                if (lastUpdated !== undefined) {
                    var luString = that._('Updated', lang) + ': ' +
                        dateAsHTML(lastUpdated, lang, that.options.timezone);
                    var lastP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text_extra);
                    lastP.innerHTML = luString;
                }
                if (epoch !== undefined) {
                    var eString = that._('Analysis', lang) + ': ' +
                        dateAsHTML(epoch, lang, that.options.timezone);
                    var epochP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text_extra);
                    epochP.innerHTML = eString;
                }
                if (lastUpdated !== undefined && updatesPerDay !== undefined) {
                    var nextUpdate = moment(lastUpdated).add(24.0/updatesPerDay, 'hours');
                    var neString = that._('Expected update', lang) + ': ' +
                        dateAsHTML(nextUpdate, lang, that.options.timezone);
                    var nextP = L.DomUtil.create('p', 'fcoo-legend-item-text-p', item_text_extra);
                    nextP.innerHTML = neString;
                }
                var br = L.DomUtil.create('br', '', that._container);

                $(itemMainSpan).click(function(){
                    $(this).find('.fcoo-legend-item-compress').toggleClass('fa-caret-square-o-right');
                    $(item_text_extra).slideToggle();
                });
                if (that.options.collapsedInfo) {
                    $(btn).click();
                }
            });
        },

        /**
         * Internationalization of some texts used in the legend.
         * @param String key the key of the text item
         * @param String lang the language id
         * @return String the localized text item or the id if there's no translation found
         */
        _: function(key, lang) {
            var i18n = {
                en: {
                      'Significant wave height of combined wind waves and swell': 'Wave height',
                      'degC': '&deg;C',
                      'Temp.': 'Temperature'
                },
                da: {
                      'Source': 'Kilde',
                      'Updated': 'Opdateret',
                      'Analysis': 'Analyse',
                      'Expected update': 'Forventes opdateret',
                      'Wave height': 'Bølgehøjde',
                      'Mean wave period': 'Bølgeperiode',
                      'Vel.': 'Strømhastighed',
                      'Current speed': 'Strømhastighed',
                      'Current': 'Strømhastighed',
                      'Elevation': 'Vandstand',
                      'Temperature': 'Temperatur',
                      'Temp.': 'Temperatur',
                      'Salinity': 'Salinitet',
                      'Sea surface temperature': 'Temperatur',
                      'Sea surface salinity': 'Salinitet',
                      'Wind speed': 'Vindhastighed',
                      'Wind': 'Vindhastighed',
                      'Air temperature (2m)': '2 meter temperatur',
                      'Sea ice concentration': 'Haviskoncentration',
                      'Sea ice thickness': 'Havistykkelse',
                      'Sea ice drift speed': 'Havisdrifthastighed',
                      'Visibility': 'Sigtbarhed',
                      'Total precipitation flux': 'Nedbør',
                      '2 metre temperature': '2 meter temperatur',
                      'Total cloud cover': 'Skydække',
                      'Significant wave height of combined wind waves and swell': 'Bølgehøjde',
                      'mm/hour': 'mm/time',
                      'degC': '&deg;C',
                      'knots': 'knob',
                      'fraction': 'fraktion',
                      'meters': 'meter'
                }
            };
        
            if (i18n[lang] !== undefined && i18n[lang][key] !== undefined) {
                return  i18n[lang][key];
            } else if (i18n.en !== undefined && i18n.en[key] !== undefined) {
                return  i18n.en[key];
            }
            return key;
        }
    });
})();

