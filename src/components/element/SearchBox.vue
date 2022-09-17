<template>
  <el-autocomplete
    class="searchBox"
    v-model="state"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    @select="handleSelect"
    clearable
    :trigger-on-focus="false"
  >
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
      <span class="link">{{ item.link }}</span>
    </template>
  </el-autocomplete>
</template>

<script setup>
import { onMounted, ref, toRaw, toRef, toRefs, watch } from "vue";

const props = defineProps({
  request: Object,
});

const { request } = toRaw(props);
const { list } = toRefs(request);
const { placeholder } = props;

const state = ref("");
watch(state, (current, previous) => {
  const queryInfo = {
    content: current,
    ...request,
    list: undefined,
  };

  request.Reqs(list, queryInfo);
});

const links = ref([]);

const querySearch = (queryString, cb) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value;
  cb(results);
};
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
const loadAll = () => {
  return [];
};
const handleSelect = (item) => {
  console.log(item);
};

onMounted(() => {
  links.value = loadAll();
});

defineExpose({
  state,
});
</script>

<style>
.searchBox {
  width: 100%;
}
</style>