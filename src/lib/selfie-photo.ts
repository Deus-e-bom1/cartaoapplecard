// Browser-only, memory-only holder for the just-captured selfie photo.
// Never persisted, never sent anywhere; cleared as soon as the preparation
// step finishes. Lives outside router state on purpose.
let photo: string | null = null;

export function setSelfiePhoto(value: string) {
  photo = value;
}

export function getSelfiePhoto() {
  return photo;
}

export function clearSelfiePhoto() {
  photo = null;
}
