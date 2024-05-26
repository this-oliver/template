# the purpose of this script is to automate the process of
# building, tagging and pushing the package images to the 
# docker registry.

curr_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
packages_dir=$curr_dir/../../packages

user=thisoliver
repo="template"
packages=("backend" "frontend")
sha=$(git rev-parse HEAD)

# for each package, build, tag and push the image
for package in "${packages[@]}"
do
    # Build the image (add support for arm architecture)
    docker build -t $repo:$package $packages_dir/$package

    # Tag the image
    docker tag $repo:$package $user/$repo:$package
    docker tag $repo:$package $user/$repo:$package-$sha

    # Push the image
    docker push $user/$repo:$package
    docker push $user/$repo:$package-$sha
done
