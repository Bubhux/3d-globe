// app/components/globe/libs/orbit-controls.js
/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/three-orbitcontrols@2.102.2/OrbitControls.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */

import { THREE } from '~/components/globe/utils/three';


THREE.OrbitControls = function (e, t) {
    var n, o, a, i, r;
    this.object = e;
    this.domElement = void 0 !== t ? t : document;
    this.enabled = !0;
    this.target = new THREE.Vector3();
    this.minDistance = 0;
    this.maxDistance = 1 / 0;
    this.minZoom = 0;
    this.maxZoom = 1 / 0;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.minAzimuthAngle = -1 / 0;
    this.maxAzimuthAngle = 1 / 0;
    this.enableDamping = !1;
    this.dampingFactor = 0.25;
    this.enableZoom = !0;
    this.zoomSpeed = 1;
    this.enableRotate = !0;
    this.rotateSpeed = 1;
    this.enablePan = !0;
    this.panSpeed = 1;
    this.screenSpacePanning = !1;
    this.keyPanSpeed = 7;
    this.autoRotate = !1;
    this.autoRotateSpeed = 2;
    this.enableKeys = !0;
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
    this.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.RIGHT
    };
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    this.getPolarAngle = function () {
        return h.phi;
    };

    this.getAzimuthalAngle = function () {
        return h.theta;
    };

    this.saveState = function () {
        s.target0.copy(s.target);
        s.position0.copy(s.object.position);
        s.zoom0 = s.object.zoom;
    };

    this.reset = function () {
        s.target.copy(s.target0);
        s.object.position.copy(s.position0);
        s.object.zoom = s.zoom0;
        s.object.updateProjectionMatrix();
        s.dispatchEvent(c);
        s.update();
        d = u.NONE;
    };

    this.update = (n = new THREE.Vector3(), o = (new THREE.Quaternion()).setFromUnitVectors(e.up, new THREE.Vector3(0, 1, 0)), a = o.clone().inverse(), i = new THREE.Vector3(), r = new THREE.Quaternion(), function () {
        var e = s.object.position;
        return n.copy(e).sub(s.target), n.applyQuaternion(o), h.setFromVector3(n), s.autoRotate && d === u.NONE && M(2 * Math.PI / 60 / 60 * s.autoRotateSpeed), h.theta += E.theta, h.phi += E.phi, h.theta = Math.max(s.minAzimuthAngle, Math.min(s.maxAzimuthAngle, h.theta)), h.phi = Math.max(s.minPolarAngle, Math.min(s.maxPolarAngle, h.phi)), h.makeSafe(), h.radius *= b, h.radius = Math.max(s.minDistance, Math.min(s.maxDistance, h.radius)), s.target.add(f), n.setFromSpherical(h), n.applyQuaternion(a), e.copy(s.target).add(n), s.object.lookAt(s.target), !0 === s.enableDamping ? (E.theta *= 1 - s.dampingFactor, E.phi *= 1 - s.dampingFactor, f.multiplyScalar(1 - s.dampingFactor)) : (E.set(0, 0, 0), f.set(0, 0, 0)), b = 1, !!(g || i.distanceToSquared(s.object.position) > p || 8 * (1 - r.dot(s.object.quaternion)) > p) && (s.dispatchEvent(c), i.copy(s.object.position), r.copy(s.object.quaternion), g = !1, !0);
    });

    this.dispose = function () {
        s.domElement.removeEventListener("contextmenu", _, !1);
        s.domElement.removeEventListener("mousedown", U, !1);
        s.domElement.removeEventListener("wheel", z, !1);
        s.domElement.removeEventListener("touchstart", I, !1);
        s.domElement.removeEventListener("touchend", K, !1);
        s.domElement.removeEventListener("touchmove", X, !1);
        document.removeEventListener("mousemove", Y, !1);
        document.removeEventListener("mouseup", Z, !1);
        window.removeEventListener("keydown", F, !1);
    };

    var s = this, c = { type: "change" }, l = { type: "start" }, m = { type: "end" }, u = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 }, d = u.NONE, p = 1e-6, h = new THREE.Spherical(), E = new THREE.Spherical(), b = 1, f = new THREE.Vector3(), g = !1, T = new THREE.Vector2(), v = new THREE.Vector2(), y = new THREE.Vector2(), R = new THREE.Vector2(), O = new THREE.Vector2(), H = new THREE.Vector2(), w = new THREE.Vector2(), P = new THREE.Vector2(), j = new THREE.Vector2();

    function L() {
        return Math.pow(0.95, s.zoomSpeed);
    }

    function M(e) {
        E.theta -= e;
    }

    function C(e) {
        E.phi -= e;
    }

    var N, S = (N = new THREE.Vector3(), function (e, t) {
        N.setFromMatrixColumn(t, 0), N.multiplyScalar(-e), f.add(N);
    }), A = function () {
        var e = new THREE.Vector3();
        return function (t, n) {
            !0 === s.screenSpacePanning ? e.setFromMatrixColumn(n, 1) : (e.setFromMatrixColumn(n, 0), e.crossVectors(s.object.up, e)), e.multiplyScalar(t), f.add(e);
        };
    }(), D = function () {
        var e = new THREE.Vector3();
        return function (t, n) {
            var o = s.domElement === document ? s.domElement.body : s.domElement;
            if (s.object.isPerspectiveCamera) {
                var a = s.object.position;
                e.copy(a).sub(s.target);
                var i = e.length();
                i *= Math.tan(s.object.fov / 2 * Math.PI / 180), S(2 * t * i / o.clientHeight, s.object.matrix), A(2 * n * i / o.clientHeight, s.object.matrix);
            } else if (s.object.isOrthographicCamera) {
                S(t * (s.object.right - s.object.left) / s.object.zoom / o.clientWidth, s.object.matrix), A(n * (s.object.top - s.object.bottom) / s.object.zoom / o.clientHeight, s.object.matrix);
            } else {
                console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
                s.enablePan = !1;
            }
        };
    }();

    function x(e) {
        s.object.isPerspectiveCamera ? b /= e : s.object.isOrthographicCamera ? (s.object.zoom = Math.max(s.minZoom, Math.min(s.maxZoom, s.object.zoom * e)), s.object.updateProjectionMatrix(), g = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), s.enableZoom = !1);
    }

    function k(e) {
        s.object.isPerspectiveCamera ? b *= e : s.object.isOrthographicCamera ? (s.object.zoom = Math.max(s.minZoom, Math.min(s.maxZoom, s.object.zoom / e)), s.object.updateProjectionMatrix(), g = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), s.enableZoom = !1);
    }

    function V(e) {
        R.set(e.clientX, e.clientY);
    }

    function U(e) {
        if (!1 !== s.enabled) {
            switch (e.preventDefault(), s.domElement.focus ? s.domElement.focus() : window.focus(), e.button) {
                case s.mouseButtons.LEFT:
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                        if (!1 === s.enablePan) return;
                        V(e), d = u.PAN;
                    } else {
                        if (!1 === s.enableRotate) return;
                        !function (e) {
                            T.set(e.clientX, e.clientY);
                        }(e), d = u.ROTATE;
                    }
                    break;
                case s.mouseButtons.MIDDLE:
                    if (!1 === s.enableZoom) return;
                    V(e), d = u.DOLLY;
                    break;
                case s.mouseButtons.RIGHT:
                    if (!1 === s.enablePan) return;
                    V(e), d = u.PAN;
            }
            s.dispatchEvent(l);
        }
    }

    function F(e) {
        !1 !== s.enabled && s.enableKeys && (37 === e.keyCode ? M(1) : 38 === e.keyCode ? C(1) : 39 === e.keyCode ? M(-1) : 40 === e.keyCode && C(-1));
    }

    function Z(e) {
        if (!1 !== s.enabled) {
            d = u.NONE;
            s.dispatchEvent(m);
        }
    }

    function I(e) {
        if (!1 !== s.enabled) {
            e.preventDefault();
            var t = e.changedTouches[0];
            switch (t.clientX, t.clientY, t.identifier, e.touches.length) {
                case 1:
                    V(t), d = u.TOUCH_ROTATE;
                    break;
                case 2:
                    V(t), d = u.TOUCH_DOLLY_PAN;
            }
            s.dispatchEvent(l);
        }
    }

    function K(e) {
        if (!1 !== s.enabled) {
            d = u.NONE;
            s.dispatchEvent(m);
        }
    }

    function Y(e) {
        if (!1 !== s.enabled) {
            switch (d) {
                case u.ROTATE:
                    if (!1 === s.enableRotate) return;
                    const t = e.clientX - T.x;
                    const n = e.clientY - T.y;
                    M(2 * s.rotateSpeed * Math.PI * t / s.domElement.clientWidth);
                    C(2 * s.rotateSpeed * Math.PI * n / s.domElement.clientHeight);
                    T.set(e.clientX, e.clientY);
                    break;
                case u.DOLLY:
                    if (!1 === s.enableZoom) return;
                    const i = e.clientY - R.y;
                    x(1 + i / 100);
                    R.set(e.clientX, e.clientY);
                    break;
                case u.PAN:
                    if (!1 === s.enablePan) return;
                    const r = e.clientX - R.x;
                    const o = e.clientY - R.y;
                    A(-r, -o);
                    R.set(e.clientX, e.clientY);
            }
            return s.update(), void s.dispatchEvent(c);
        }
    }

    this.domElement.addEventListener("contextmenu", _, !1);
    this.domElement.addEventListener("mousedown", U, !1);
    this.domElement.addEventListener("wheel", z, !1);
    this.domElement.addEventListener("touchstart", I, !1);
    this.domElement.addEventListener("touchend", K, !1);
    this.domElement.addEventListener("touchmove", X, !1);
    document.addEventListener("mousemove", Y, !1);
    document.addEventListener("mouseup", Z, !1);
    window.addEventListener("keydown", F, !1);
    this.update();
};

// Export the OrbitControls class
export default THREE.OrbitControls;