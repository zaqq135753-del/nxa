export class Scene3DManager {
  private isDisposed = false;
  private hasWebGL = false;

  constructor() {
    this.hasWebGL = this.checkWebGLSupport();
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  public getRenderingMode(): 'WEBGL_3D' | 'FALLBACK_2D' {
    return this.hasWebGL ? 'WEBGL_3D' : 'FALLBACK_2D';
  }

  public dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;
  }

  public isCleanedUp(): boolean {
    return this.isDisposed;
  }
}
