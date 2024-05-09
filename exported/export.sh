IMAGES=(spotify-anki-frontend-prod spotify-anki-backend-prod spotify-anki-nginx-prod)
for image in ${IMAGES[@]}; do
    echo "Saving image $image"
    docker image save -o $image.tar $image
done
