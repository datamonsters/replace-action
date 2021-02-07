# replace-action

This lightweight action replaces substrings in files. It is useful for CI process when you need to update your configs depending on the previous steps results.

# Usage

See [action.yml](action.yml)

```yaml

uses: datamonsters/replace-action
with:
  files: 'path1/file1,path2/file2'
  replacements: 'foo=bar,@FOO=Bar_Value'
```
As the replacement is using regular expression, you should avoid 'special' characters which might be misinterpreted in the RegEx context.

# Example

Consider you need to apply k8s deployment with container you've built on the previous step of you workflow.
You have a `app-deployment.yaml` file like this:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: default
  name: simple-app
spec:
  selector:
    matchLabels:
      simple-app: ""
  template:
    metadata:
      labels:
        simple-app: ""
    spec:
      containers:
      - name: simple-app
        image: $IMAGE
        env:
        - name: HELLO_MSG
          value: stranger
```
Your workflow in this case will be like this:
```yaml
name: Deploy app
on: [push]
jobs:
  deploy:
  runs-on: ubuntu-latest
    steps:

      - name: Build and push docker
        id: build_step
        run: |
          docker build . -t ${{ secrets.AWS_ACC_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/demo:${{ github.sha }}
          docker push ${{ secrets.AWS_ACC_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/demo:${{ github.sha }}

      - name: Replace image in config
      uses: ./.github/actions/replace
      with:
        files: app-deployment.yaml
        replacements: '$IMAGE=${{ secrets.AWS_ACC_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/demo:${{ github.sha }}'
    
    - name: Apply centraldashboard config
      uses: steebchen/kubectl@master
      env:
        KUBE_CONFIG_DATA: ${{ secrets.KUBE_CONFIG_DATA }}
        KUBECTL_VERSION: "1.14"
      with:
        args: apply -f app-deployment.yaml

```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
