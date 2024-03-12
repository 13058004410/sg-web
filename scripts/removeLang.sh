rmLangs=(

)


LOCALES_DIR="./locales"



# 遍历 locales 目录下的所有 zh-CN.yml 文件，遍历所有的key，然后通过 t('key') 的方式在 src/* 中查找是否有对应的 key，如果没有，则添加到 rmLangs 数组中，最后打印
for file in ${LOCALES_DIR}/zh-CN.yml; do
    if [ -f "$file" ]; then
        for key in $(grep -oE "^[[:alnum:]_]+:" "${file}" | sed 's/://'); do
            if [ -z "$(grep -r "t('${key}'" src/*)" ]; then
                rmLangs+=("${key}")
            fi
        done
    fi
done

# 打印 rmLangs 数组，每行回车
# for key in ${rmLangs[@]}; do
#     echo "${key}"
# done


# 遍历 locales 目录下的所有 .yml 文件，删除指定的 key
# vip_rule_1 ./locales/en-US.yml
# python3 ./scripts/removeLang.py "vip_rule_1" "./locales/en-US.yml"
for file in ${LOCALES_DIR}/*.yml; do
    if [ -f "$file" ]; then
        for key in ${rmLangs[@]}; do
            python3 ./scripts/removeLang.py "${key}" "${file}"
            echo "remove ${key} ${file}"
        done
    fi
done


# echo "remove provably_fair_calculation ./locales/zh-CN.yml"
# str="provably_fair_calculation"
# file="./locales/zh-CN.yml"
# python3 ./scripts/removeLang.py "${str}" "${file}"