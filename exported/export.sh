IMAGES=(spotify-anki-frontend-prod spotify-anki-backend-prod spotify-anki-nginx-prod)
for image in ${IMAGES[@]}; do
    echo "Exporting image $image"
    docker save $image | gzip > $image.tar.gz
done
