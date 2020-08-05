// ---------------------------------------------------------
// SPX Canvas Particles (spxparticles.js)
// (c) 2020 <tuomo@smartpx.fi>
// MIT License
//
// Performant stream or a burst of particles on HTML canvas.
// Let me know if you find this useful 👍
// 
// https://github.com/TuomoKu/spxparticles
// v.1.0.0 (8 Aug 2020)
//
// Usage: spawnSPXParticles('canvasElement');
// ---------------------------------------------------------

function spawnSPXParticles(canvasID, particleAmount){

    // An example configuration:
    // var spxParticleSettings = {
    //     p_texture     :  '../img/fb-haha.png', 
    //     p_blending    :  'color-dodge',   /* (empty), screen, overlay, multiply, color-dodge... */
    //     emit_delay    :  30,              /* Delay in between each new particle (small = performance impact!)   */
    //     emit_left     :  10,              /* Emitter zone left % */
    //     emit_right    :  90,              /* Emitter zone right % */
    //     emit_top      :  80,              /* Emitter zone top % */
    //     emit_bottom   :  90,              /* Emitter zone bottom % */
    //     zone_visible  :  false,           /* Preview emitter zone on canvas */
    //     gravity       :  -4,              /* Y move speed (negative: up) */
    //     rnd_grav_mult :  2,               /* Random speed multiplier */
    //     spread_x      :  0.5,             /* Dispersion value */
    //     wind          :  2,               /* Horizontal push force */
    //     wave_size     :  1,               /* Size of wavy motion */
    //     wave_freq     :  80,              /* Speed of wavy motion */
    //     p_life        :  250,             /* Maximum particle lifespan duration */
    //     p_rnd_life    :  20,              /* Randomize lifespan */
    //     p_size        :  110,             /* Particle born size in pixels */
    //     p_rnd_size    :  80,              /* Randomize size */
    //     p_size_mult   :  0.98,            /* Size multiplier, scale down/up gradually */
    //     p_rotation    :  0,               /* Spawn rotation (deg) */
    //     p_rnd_rot     :  15,              /* Randomize rotation (deg) */
    //     p_rot_wobble  :  true,            /* wobble back and forth? */
    //     p_rot_amount  :  1.2,             /* Rotation speed */
    //     p_rot_wofreq  :  40,              /* Wobble frequency */
    //     p_rot_dual    :  false,           /* both directions CW and CCW */ 
    //     p_opacity     :  100,             /* Opacity of a particle when born (%) */
    //     p_rnd_opa     :  0,               /* Randomize born opacity (%) */
    //     p_opa_mult    :  0.8,             /* Opacity multiplier, fade gradually */
    //     p_fade_start  :  150,             /* When do we start to fade out */
    //     p_rnd_fstart  :  20               /* Randomize fade start age */
    // }; 

    var canvas    = document.getElementById(canvasID);
    let partImage = new Image();
    partImage.src = spxParticleSettings.p_texture;
    let born = 0;
    var context = canvas.getContext("2d");
    class SpxParticle {
        constructor() {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            this.age = 0;
            this.dead = false;
            this.killAge = spxParticleSettings.p_life + this.rnd(spxParticleSettings.p_rnd_life);
            this.fadeStart = spxParticleSettings.p_fade_start + this.rnd(spxParticleSettings.p_rnd_fstart);
            this.image = partImage;
            this.x = this.rndNro(canvas.width / 100 * spxParticleSettings.emit_left, canvas.width / 100 * spxParticleSettings.emit_right);
            this.y = this.rndNro(canvas.height / 100 * spxParticleSettings.emit_top, canvas.height / 100 * spxParticleSettings.emit_bottom);
            this.vx = this.rnd(spxParticleSettings.spread_x);
            this.vy = (spxParticleSettings.gravity/100)*Math.max(1,this.rnd(spxParticleSettings.rnd_grav_mult));
            this.size = spxParticleSettings.p_size + this.rnd(spxParticleSettings.p_rnd_size);
            this.maxSize = spxParticleSettings.p_size;  
            this.phase = Math.random() * 360;
            this.opacity = spxParticleSettings.p_opacity/100 + this.rnd(spxParticleSettings.p_rnd_opa/100);
            this.rotwobble = spxParticleSettings.p_rot_wobble;
            this.rotspeed = spxParticleSettings.p_rot_amount;
            if (spxParticleSettings.p_rot_dual){this.rotspeed = ( this.rndNro(-1,1) < 0 ) ? spxParticleSettings.p_rot_amount*-1 : spxParticleSettings.p_rot_amount;}
            this.rotate = spxParticleSettings.p_rotation + this.rnd(spxParticleSettings.p_rnd_rot);
            this.fadeStartPos = (canvas.height/2) + this.rndNro(-30,30); 
            born++; 
        }

        rnd(value) {return this.rndNro(value*-1, value)}
        degToRad(deg){return deg * Math.PI / 180}
        rndNro(min, max) {return Math.random() * (max - min) + min;}
       
        redraw() {
            this.phase++;
            this.age++;
            this.vy += spxParticleSettings.gravity/100;
            this.y += this.vy;
            this.x += this.vx + spxParticleSettings.wave_size * Math.sin(3.14 * this.phase / spxParticleSettings.wave_freq) + spxParticleSettings.wind/10;
            if (this.rotwobble) { this.rotate += spxParticleSettings.p_rot_amount * Math.sin(3.14 * this.phase / spxParticleSettings.p_rot_wofreq); }
            else{this.rotate += this.rotspeed;}

            if (this.age >= this.fadeStart) {
                this.opacity = this.opacity * spxParticleSettings.p_opa_mult;
                this.size = this.size * spxParticleSettings.p_size_mult;
            }

            if (spxParticleSettings.zone_visible){
                context.globalAlpha = 1.0;
                context.strokeStyle = 'green';
                let L = canvas.width / 100 * spxParticleSettings.emit_left;
                let T = canvas.height / 100 * spxParticleSettings.emit_top;
                let R = canvas.width / 100 * spxParticleSettings.emit_right;
                let W = canvas.width - L - (canvas.width / 100 * (100-spxParticleSettings.emit_right));
                let H = canvas.height - T - (canvas.height / 100 * (100-spxParticleSettings.emit_bottom));
                context.rect(L,T,W,H);
                context.stroke();
            }

            context.globalAlpha = this.opacity;
            context.globalCompositeOperation = spxParticleSettings.p_blending; 
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.degToRad(this.rotate));
            context.drawImage(this.image, -this.size/2, -this.size/2, this.size, this.size);
            context.restore();
            this.dead = ( this.y < 0 || this.opacity <= 0 || this.age > this.killAge ) ? true : false;  
        }
    } 

    let particleArr = []; 
    let id = setInterval( () => {
        particleArr.push( new SpxParticle() ); 
        if (particleAmount && born>=particleAmount){
            clearInterval(id);
        }
    }, spxParticleSettings.emit_delay );

    function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame( loop );
        let i; 
        for( i = 0; i < particleArr.length; ++i ) {
            if( particleArr[i].dead  ) {
                particleArr.splice(i,1); 
            }
        }
        if (document.getElementById('particle-count-display')){
            document.getElementById('particle-count-display').innerText= "Particle count: " + particleArr.length;
        }
        
        for( i = 0; i < particleArr.length; ++i ) {
            particleArr[i].redraw(); 
        }
    }
    loop();   
}