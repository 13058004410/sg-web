import yaml
import sys

    

# Example usage:
# remove_string_from_yaml("vip_rule_1", "./locales/en-US.yml")


def remove_string_from_yaml(input_string, yaml_file):
    print("Removing string from YAML file: ", input_string, " from ", yaml_file)
    # 读取 YAML 文件
    with open(yaml_file, 'r', encoding='utf-8') as file:
        data = yaml.safe_load(file)

   # 删除 input_string
    if input_string in data:
        del data[input_string]

    # 写回 YAML 文件
    with open(yaml_file, 'w', encoding='utf-8') as file:
        yaml.dump(data, file, allow_unicode=True)



if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 removeLang.py <input_string> <yaml_file>")
        sys.exit(1)

    remove_string_from_yaml(sys.argv[1], sys.argv[2])