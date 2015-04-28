/*

The vedio service is facade for three types of videos Youtube, Brightcove and Viemo
Usage Example

//creating new instance of video
var video = IEA.video(container, config)

//public methods
video.getVideoContainer()
video.getPlayer()
video.play()
video.pause()
video.stop()
video.destroy()
video.restart()
video.seek()
video.resize()

//Events

*/
define([
    'iea',
    'vimeoAPI',
    'brightcoveVideo'

], function(
    IEA,
    VimeoAPI,
    BrightcoveVideo

) {
    'use strict';

    IEA.service('video', function(service, app, iea) {

        // Storing all the video data
        IEA.videoData = (IEA.videoData) ? IEA.videoData : {};

        /**
         * Video class
         * @method Video
         * @param {object} options
         * @return ThisExpression
         */
        var Video = function() {
            return this;
        };

        _.extend(Video.prototype, {

            container: null,
            player: null,
            type: null,
            triggerMethod: IEA.triggerMethod,

            /**
             * Initialization of the service
             * @method initialize
             * @param {} options
             * @param container
             * @return ThisExpression
             */
            initialize: function(container, options) {
                var self = this,
                    defaultSettings = {
                        'autoplay': true,
                        'autohide': true,
                        'controls': false,
                        'loopPlayback': true,
                        'showRelated': true,
                        'allowFullScreen': false,
                        'theme': '',
                        'wmode': 'transparent',
                        'videoId': ''
                    };

                this.options = _.extend(defaultSettings, options);

                this.container = container;

                this.type = this.options.viewType;
                this.type = String(this.type).toLowerCase();

                this.swfControls = false;
                this._configureVideo();
                return this;
            },

            /**
             * This method will return video container
             * @method getVideoContainer
             * @param container
             * @return
             */
            getVideoContainer: function(container) {
                var $wrapper = $('<div class="video-container"></div>');

                if(!container.children().hasClass('video-container')) {
                    container.html($wrapper);
                    return $('.video-container', container);
                } else {
                    return $('.video-container', container);
                }
            },

            /**
             * This method will return player
             * @method player
             * @return MemberExpression
             */
            getPlayer: function() {
                return this.player;
            },

            /**
             * Play the video
             * @method play
             * @return
             */
            play: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.playVideo === 'function') {
                        //this.player.playVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.playVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('play');
                    }

                    //this.player.vimeo('play');
                    break;
                case 'brightcove':

                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('play');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.playMedia();
                        } else {
                            this.html5Player.play();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:play', this);
            },

            /**
             * Pause the vedio
             * @method pause
             * @return
             */
            pause: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.pauseVideo === 'function') {
                        //this.player.pauseVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.pauseVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('pause');
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.pauseMedia();
                        } else {
                            this.html5Player.pause();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:pause', this);
            },

            /**
             * Stop the vedio
             * @method stop
             * @return
             */
            stop: function() {
                switch (this.type) {

                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.stopVideo === 'function') {
                        //this.player.stopVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.stopVideo();
                    }
                    break;

                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('unload');
                    }
                    break;

                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                        this.$videoNode.brightcoveVideo('seek', 0);
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.stopMedia();
                        } else {
                            this.html5Player.pause();
                            this.html5Player.currentTime = 0;
                        }
                    }
                    break;

                }
                this.triggerMethod('video:stop', this);
            },

            /**
             * Destroy the video's container
             * @method destory
             * @return
             */
            destroy: function() {
                if(this.container) {
                    this.container.html('');
                }
                this.triggerMethod('video:destroy', this);
            },

            /**
             * Restarts the video
             * @method restart
             * @return
             */
            restart: function() {
                this.seek(0);
                this.play();
                this.triggerMethod('video:restart', this);
            },

            /**
             * Resizes the container size
             * @method resize
             * @return
             */
            resize: function(width, height) {
                if(width && height) {
                    if(this.type === 'brightcove') {
                        this.$videoNode.brightcoveVideo('setSize', width, height);
                    } else {
                        $(this.container).css({width: width, height: height});
                    }
                }
                this.triggerMethod('video:resize', this);
            },

            /**
             * Description
             * @method seek
             * @return
             */
            seek: function(seconds) {

                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.seekTo === 'function') {
                        IEA.videoData[this.options.randomNumber].playerObj.seekTo(seconds);
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('seekTo', seconds);
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('seek', seconds);
                    }
                    break;
                case 'html5':
                    if (this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.setCurrentTime(seconds);
                        } else {
                            this.html5Player.currentTime = seconds;
                        }
                    }
                    break;
                }
                this.triggerMethod('video:seek', this);
            },

            toggleMute: function() {
                switch (this.type) {
                    case 'html5':
                        if(!this.swfControls) {
                            if (this.html5Player.muted) {
                                this.html5Player.muted = false;
                                this.triggerMethod('video:unmuted', this);
                            } else {
                                this.html5Player.muted = true;
                                this.triggerMethod('video:muted', this);
                            }
                        }
                        break;
                }
            },

            /**
             * ----------------------------------------------------------------------------- *\
             * private Methods
             * \* -----------------------------------------------------------------------------*/

             /**
             * This method is used to configure vidoes
             * @method _configureVideo
             * @return
             */
            _configureVideo: function() {
                var videoType = this.type,
                    self = this,
                    container = this.container;

                switch(videoType) {
                    case 'youtube':
                        IEA.videoData[this.options.randomNumber] = {};
                        IEA.videoData[this.options.randomNumber].playerObj = {options: this.options, container: container};
                        IEA.videoData[this.options.randomNumber].handler = this;
                        this._loadYoutubeVideo();
                        break;

                    case 'brightcove':

                        this.options = _.extend(this.options, {
                            'playerID': app.getValue('brightcovePlayerId'),
                            'playerKey': app.getValue('brightcovePlayerKey')
                        });
                        this._loadBrightcoveVideo();
                        break;

                    case 'vimeo':

                        this._loadVimeoVideo();
                        break;

                    case 'html5':

                        this._loadHtml5Video();
                        break;

                    default:
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideo
             * @return
             */
            _loadYoutubeVideo: function() {
                var self = this;
                if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {
                    window.onYouTubePlayerAPIReady = function () {
                        var video = null,
                            key;

                        for(key in IEA.videoData) {
                            video = IEA.videoData[key].playerObj;
                            self._onYtAPIReady.apply(self, [video.options.randomNumber, video.container]);
                        }
                        //IEA.videoData = {};
                    };

                    $.getScript('//www.youtube.com/iframe_api');
                } else {
                    this._onYtAPIReady.apply(this, [this.options.randomNumber, this.container]);
                }

            },

            /**
             * Description
             * @return
             * @method _loadBrightcoveVideo
             * @return
             */
            _loadBrightcoveVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this;

                this.$videoNode = $videoNode;

                $videoNode.brightcoveVideo({
                    'playerID': config.playerID,
                    '@videoPlayer': config.videoId,
                    'autoStart': config.autoplay,

                    'templateReadyHandler': function(evt) {
                        self._onTemplateReady(evt);
                    },
                    templateErrorHandler: function(evt) {
                        self.triggerMethod('brightcove:error', evt);
                    }
                });
            },

            /**
             * Description
             * @return
             * @method _loadHtml5Video
             * @return
             */
            _loadHtml5Video: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    tagName = 'video';

                config.randomNumber = (config.randomNumber) ? config.randomNumber : Math.floor((Math.random() * 100) + 1);

                // check for html5 player
                if(document.createElement(tagName).canPlayType) {
                    this._initHtml5Player(tagName, config);
                } else {
                    // fall back option - flv player
                    this._initFlashPlayer(config);
                }
            },

            /**
             * Description
             * @method _initHtml5Player
             * @return
             */
            _initHtml5Player: function(tagName, config) {
                var videoElement = document.createElement(tagName),
                    $videoNode = this.getVideoContainer(this.container),
                    id = 'videoplayer_' + config.randomNumber,
                    sourceElements = [],
                    videoConfig = {
                        'id': id,
                        'poster':   (config.thumbnailUrl) ? config.thumbnailUrl : (config.fallbackUrl) ? config.fallbackUrl : '',
                        'preload':  'auto',
                    };


                if(typeof config.autoplay !== 'undefined' && config.autoplay) {
                    videoConfig.autoplay = '';
                }

                if(typeof config.showControls !== 'undefined' && config.showControls) {
                    videoConfig.controls = '';
                }

                if(typeof config.loopPlayback !== 'undefined' && config.loopPlayback) {
                    videoConfig.loop = '';
                }

                if(typeof config.audio !== 'undefined' && !config.audio) {
                    videoConfig.muted = '';
                }

                for(var key in videoConfig) {
                    videoElement.setAttribute(key, videoConfig[key]);
                }

                sourceElements.push({src: config.videoFormats.mp4Video, type: 'video/mp4',  codecs: 'avc1.42E01E,mp4a.40.2'});
                sourceElements.push({src: config.videoFormats.oggVideo, type: 'video/ogg',  codecs: 'theora,vorbis'});

                for(var i in sourceElements) {
                    var sourceElement = document.createElement('source');

                    for(var attr in sourceElements[i]) {
                        sourceElement.setAttribute(attr, sourceElements[i][attr]);
                    }

                    videoElement.appendChild(sourceElement);
                }

                $videoNode.append(videoElement);
                this.html5Player = videoElement;
                this.isPlayerReady = true;

                this.triggerMethod('video:loaded', this);

            },

            /**
             * Description
             * @method _initFlashPlayer
             * @return
             */
            _initFlashPlayer: function(config) {
                //randomNumber
                var videoElement = document.createElement('div'),
                    $videoNode = this.getVideoContainer(this.container),
                    src = app.getValue('flashPlayer'),
                    id = 'swfplayer_' + config.randomNumber,
                    playerVars = [
                        'id=' + id,
                        'isvideo=' + true,
                        'autoplay=' + config.autoplay,
                        'preload=' + 'none',
                        'startvolume=' + (config.audio ? '0.8' : '0'),
                        'timerrate=' + '250',
                        'pseudostreamstart=' + 'start',
                        'controls=' + config.showControls,
                        'file=' + config.videoFormats.flvVideo
                    ];
                this.swfControls = true;
                $videoNode.append(videoElement);
                videoElement.outerHTML = '<object type="application/x-shockwave-flash" id="' + id + '" data="' + src + '"' +
                'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">' +
                '<param name="movie" value="' + src + '" />' +
                '<param name="src" value="' + src + '" />' +
                '<param name="flashvars" value="' + playerVars.join('&amp;') + '" />' +
                '<param name="quality" value="high" />' +
                '<param name="bgcolor" value="#000000" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="allowFullScreen" value="true" />' +
                '<param name="scale" value="default" />' +
                '<img class="video-fallback-image" src="' + config.fallbackUrl + '" alt="' + config.fallbackAlt + '">' +
                '</object>';

                this.html5Player = document.getElementById(id);
                this.isPlayerReady = true;
            },

            /**
             * Description
             * @method _loadVimeoVideo
             * @return
             */
            _loadVimeoVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this,
                    playerSource = '//player.vimeo.com/video/' + config.videoId + '?api=1&player_id=vimeoplayer_' + config.videoId + '&autoplay=' + config.autoplay + '&showcontrols=' + config.showControls + '&loop='+ config.loopPlayback +'&showrelated=' + config.showRelated,
                    vimeoObject = $('<iframe></iframe>').attr({
                        'src': playerSource,
                        'id': 'vimeoplayer_' + config.videoId,
                        'frameborder': 0,
                        'webkitAllowFullScreen': config.allowFullScreen,
                        'mozallowfullscreen': config.allowFullScreen,
                        'allowFullScreen': config.allowFullScreen
                    });

                $videoNode.html(vimeoObject);

                //Listen for messages from the player
                $(window).on('message onmessage', function(evt) {
                    var origin = evt.originalEvent.origin,
                        isVimeo = origin.indexOf('vimeo');
                    if(isVimeo !== -1) {
                        self._onMessageRecievedVimeo(evt, vimeoObject, playerSource);
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

             /**
             * Description
             * @method _onTemplateReady
             * @returnab saile
             */
            _onTemplateReady: function(evt) {
                var self = this;

                this.player = $(this);
                this.isPlayerReady = true;

                this.triggerMethod('brightcove:templateReadyHandler', this.player, evt);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'PLAY', function(evt) {
                    self.triggerMethod('brightcove:play', evt, self.player);
                });
                this.triggerMethod('video:loaded', this);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'STOP', function(evt) {
                    var videoPlayer = self.$videoNode.data('brightcoveVideo').videoPlayer,
                        totalduration, currentPosition;

                    if(self.options.loopPlayback) {
                        videoPlayer.getVideoDuration(true, function(duration) {
                            totalduration = duration;
                            videoPlayer.getVideoPosition(true, function(position) {
                                currentPosition = position;

                                // logic for loop in control goes here because COMPLETE event is called only once
                                if(currentPosition === '00:00' || currentPosition === totalduration) {
                                    self.restart();
                                    self.triggerMethod('brightcove:complete', evt, self.player);
                                }
                            });
                        });
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _onTemplateLoad
             * @return
             */
            _onTemplateLoad: function() {
                // body...
            },

            /**
             * Description
             * @method _onYtAPIReady
             * @return
             */
            _onYtAPIReady: function(playerId, container) {
                var self = this;

                if (playerId) {
                    this._loadYoutubeVideoView.apply(this, [playerId, container]);
                } else {
                    _.each(IEA.videoData, function(value, key) {
                        self._loadYoutubeVideoView.apply(self, [key, container]);
                    });
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideoView
             * @return
             */
            _loadYoutubeVideoView: function(key, container) {

                var self = this,
                    videoNode = this.getVideoContainer(container),
                    config = IEA.videoData[key].playerObj.options,
                    player;

                videoNode.html($('<div>').attr('id', key));

                // setTimeout( function() {
                this.player = new YT.Player(key, {
                    videoId: config.videoId,
                    events: {
                        'onReady': function(evt) {
                            IEA.videoData[config.randomNumber].handler.triggerMethod('youtube:onReady', evt, key);
                            IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                            // IEA.videoData[config.randomNumber].playerObj = evt.target;

                            if(!config.audio) {
                                evt.target.mute();
                            }
                            else {
                                evt.target.unMute();
                            }
                        },

                        'onStateChange': function(evt) {
                            self.triggerMethod('youtube:onStateChange', evt, key);

                            switch (evt.data) {
                            case -1:
                                self.triggerMethod('youtube:unstarted', evt, key);
                                break;
                            case 0:
                                if(config.loopPlayback) {
                                    IEA.videoData[config.randomNumber].handler.restart();
                                }
                                self.triggerMethod('youtube:ended', evt, key);
                                break;
                            case 1:
                                self.triggerMethod('youtube:playing', evt, key);
                                break;
                            case 2:
                                self.triggerMethod('youtube:paused', evt, key);
                                break;
                            case 3:
                                self.triggerMethod('youtube:buffering', evt, key);
                                break;
                            case 5:
                                self.triggerMethod('youtube:videocued', evt, key);
                                break;
                            }
                        },
                        'onError': function(error) {
                            self.triggerMethod('youtube:onError', error);
                        }
                    },
                    playerVars: {
                        'autoplay': config.autoplay,
                        'autohide': config.autohide,
                        'controls': config.showControls ? 1 : 0,
                        'loop': config.loopPlayback ? 1 : 0,
                        'rel': config.showRelated,
                        'fs': false,
                        'theme': config.theme,
                        'wmode': config.wmode,
                    }
                });
                // }, 1000);
                IEA.videoData[config.randomNumber].handler.on('youtube:onReady', function(evt) {
                    IEA.videoData[config.randomNumber].handler.player = evt.target;
                    IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                    IEA.videoData[config.randomNumber].playerObj = evt.target;
                });
                this.triggerMethod('video:loaded',this);
            },

            /**
             * Description
             * @method _onVideoReady
             * @return
             */
            _onVimeoReady: function() {
                // body...
            },

            /**
             * Description
             * @method _onMessageRecievedVimeo
             * @return
             */
            _onMessageRecievedVimeo: function(evt, vimeoObject, playerSource) {

                var data = evt.originalEvent.data,
                    self = this;

                if(data) {
                    data = JSON.parse(data);
                    switch (data.event) {
                    case 'ready':
                        this.triggerMethod('vimeo:ready', evt, vimeoObject, playerSource);
                        this._post('addEventListener', 'pause', vimeoObject, playerSource);
                        this._post('addEventListener', 'finish', vimeoObject, playerSource);
                        this._post('addEventListener', 'playProgress', vimeoObject, playerSource);
                        if(!this.options.audio) {
                            this._post('setVolume', '0', vimeoObject, playerSource);
                        }
                        else {
                            this._post('setVolume', '1', vimeoObject, playerSource);
                        }

                        this.isPlayerReady = true;
                        this.player = vimeoObject;
                        break;
                    case 'playProgress':
                        this.triggerMethod('vimeo:playProgress', data.event);
                        break;
                    case 'pause':
                        this.triggerMethod('vimeo:pause', data.event);
                        break;
                    case 'finish':
                        this.triggerMethod('vimeo:finish', data.event);
                        break;
                    }

                    this.on('vimeo:ready', function(evt, id) {
                        self.isPlayerReady = true;
                        self.player = id;
                    });
                }

                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _post
             * @return
             */
            _post: function (action, value, player, url) {
                if (url.indexOf('vimeo')) {
                    var data = {
                            method: action
                        },
                        winURL = window.location.protocol + url;

                    if (value) {
                        data.value = value;
                    }

                    if(player[0].contentWindow && player[0].contentWindow.postMessage) {
                        player[0].contentWindow.postMessage(data, winURL);
                    }
                }
            }
        });

        return Video;
    });
});
