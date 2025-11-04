<template>
  <div class="admin-page">
    <div class="page-hero">
      <div>
        <h1>用户管理控制台</h1>
        <p>洞察用户信息，灵活管理账号与角色，保障业务安全稳定运行。</p>
      </div>
      <a-space :size="12">
        <a-button shape="round" @click="handleRefresh">刷新</a-button>
        <a-button type="primary" shape="round" @click="openCreateModal">
          新建用户
        </a-button>
      </a-space>
    </div>

    <a-card class="query-card" :bordered="false">
      <a-form layout="inline" :model="queryForm" @submit.prevent>
        <a-form-item label="账号">
          <a-input
            v-model:value="queryForm.userAccount"
            allow-clear
            placeholder="请输入账号"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input
            v-model:value="queryForm.userName"
            allow-clear
            placeholder="请输入昵称"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            v-model:value="queryForm.userRole"
            allow-clear
            placeholder="全部角色"
            style="width: 180px"
          >
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space :size="12">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="paginationProps"
        row-key="id"
        bordered
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userRole'">
            <a-tag v-if="record.userRole === 'admin'" color="red">管理员</a-tag>
            <a-tag v-else color="blue">普通用户</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm
                title="确认删除该用户？"
                ok-text="删除"
                ok-type="danger"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ formatTime(record.createTime) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="createModalVisible"
      title="新建用户"
      :confirm-loading="submittingCreate"
      ok-text="创建"
      cancel-text="取消"
      @ok="handleCreate"
      destroy-on-close
    >
      <a-form layout="vertical" :model="createForm" :rules="createRules" ref="createFormRef">
        <a-form-item label="账号" name="userAccount">
          <a-input v-model:value="createForm.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="昵称" name="userName">
          <a-input v-model:value="createForm.userName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="角色" name="userRole">
          <a-select v-model:value="createForm.userRole">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="个人描述" name="userProfile">
          <a-textarea
            v-model:value="createForm.userProfile"
            placeholder="请输入个人描述"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:open="editModalVisible"
      title="编辑用户信息"
      :confirm-loading="submittingEdit"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleUpdate"
      destroy-on-close
    >
      <a-form layout="vertical" :model="editForm" :rules="editRules" ref="editFormRef">
        <a-form-item label="用户昵称" name="userName">
          <a-input v-model:value="editForm.userName" placeholder="请输入用户昵称" />
        </a-form-item>
        <a-form-item label="角色" name="userRole">
          <a-select v-model:value="editForm.userRole">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="个人描述" name="userProfile">
          <a-textarea
            v-model:value="editForm.userProfile"
            placeholder="请输入个人描述"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TablePaginationConfig, TableProps } from 'ant-design-vue'
import {
  addUser,
  deleteUser,
  listUserVoByPage,
  updateUser,
} from '@/api/userController'

const loading = ref(false)
const submittingCreate = ref(false)
const submittingEdit = ref(false)
const dataSource = ref<API.UserVO[]>([])

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 名用户`,
})

const queryForm = reactive<API.UserQueryRequest>({
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  userAccount: '',
  userName: '',
  userRole: undefined,
})

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '账号', dataIndex: 'userAccount', width: 160 },
  { title: '昵称', dataIndex: 'userName', width: 150 },
  { title: '角色', dataIndex: 'userRole', width: 120 },
  { title: '简介', dataIndex: 'userProfile' },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', dataIndex: 'actions', fixed: 'right', width: 160 },
] satisfies TableProps<API.UserVO>['columns']

const createModalVisible = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = reactive<API.UserAddRequest>({
  userAccount: '',
  userName: '',
  userRole: 'user',
  userProfile: '',
  userAvatar: '',
})

const createRules: Partial<Record<keyof API.UserAddRequest, Rule[]>> = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { min: 4, message: '账号至少 4 个字符' },
  ],
  userName: [{ required: true, message: '请输入昵称' }],
  userRole: [{ required: true, message: '请选择角色' }],
}

const editModalVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<API.UserUpdateRequest>({
  id: undefined,
  userName: '',
  userRole: 'user',
  userProfile: '',
})

const editRules: Partial<Record<keyof API.UserUpdateRequest, Rule[]>> = {
  userName: [{ required: true, message: '请输入昵称' }],
  userRole: [{ required: true, message: '请选择角色' }],
}

const paginationProps = computed<TablePaginationConfig>(() => ({
  ...pagination,
  current: pagination.current,
  pageSize: pagination.pageSize,
}))

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const formatTime = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return dateFormatter.format(date)
}

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await listUserVoByPage({
      ...queryForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    })
    const { code, data, message: msg } = res.data
    if (code === 0 && data) {
      dataSource.value = data.records ?? []
      pagination.total = data.totalRow ?? 0
      pagination.current = data.pageNumber ?? pagination.current
      pagination.pageSize = data.pageSize ?? pagination.pageSize
    } else {
      message.error(msg || '获取用户列表失败')
    }
  } catch (error) {
    message.error('获取用户列表失败，请检查网络')
  } finally {
    loading.value = false
  }
}

const handleTableChange: TableProps<API.UserVO>['onChange'] = (pager) => {
  pagination.current = pager.current ?? 1
  pagination.pageSize = pager.pageSize ?? 10
  fetchUserList()
}

const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

const handleReset = () => {
  queryForm.userAccount = ''
  queryForm.userName = ''
  queryForm.userRole = undefined
  pagination.current = 1
  fetchUserList()
}

const handleRefresh = () => {
  fetchUserList()
}

const openCreateModal = () => {
  createForm.userAccount = ''
  createForm.userName = ''
  createForm.userRole = 'user'
  createForm.userProfile = ''
  createForm.userAvatar = ''
  createModalVisible.value = true
  nextTick(() => {
    createFormRef.value?.clearValidate()
  })
}

const handleCreate = () => {
  createFormRef.value
    ?.validate()
    .then(async () => {
      submittingCreate.value = true
      try {
        const res = await addUser({
          userAccount: createForm.userAccount?.trim() ?? '',
          userName: createForm.userName,
          userRole: createForm.userRole,
          userProfile: createForm.userProfile,
          userAvatar: createForm.userAvatar,
        })
        if (res.data.code === 0) {
          message.success('新建用户成功')
          createModalVisible.value = false
          fetchUserList()
        } else {
          message.error(res.data.message || '新建用户失败，请稍后重试')
        }
      } catch (error) {
        message.error('新建用户失败，请检查网络')
      } finally {
        submittingCreate.value = false
      }
    })
    .catch(() => {})
}

const openEditModal = (record: API.UserVO) => {
  editForm.id = record.id
  editForm.userName = record.userName
  editForm.userRole = record.userRole
  editForm.userProfile = record.userProfile
  editModalVisible.value = true
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

const handleUpdate = () => {
  editFormRef.value
    ?.validate()
    .then(async () => {
      if (!editForm.id) {
        message.error('缺少用户标识，无法保存')
        return
      }
      submittingEdit.value = true
      try {
        const res = await updateUser({
          id: editForm.id,
          userName: editForm.userName,
          userRole: editForm.userRole,
          userProfile: editForm.userProfile,
        })
        if (res.data.code === 0) {
          message.success('保存成功')
          editModalVisible.value = false
          fetchUserList()
        } else {
          message.error(res.data.message || '保存失败，请稍后重试')
        }
      } catch (error) {
        message.error('保存失败，请检查网络')
      } finally {
        submittingEdit.value = false
      }
    })
    .catch(() => {})
}

const handleDelete = (record: API.UserVO) => async () => {
  if (!record.id) return
  try {
    const res = await deleteUser({ id: record.id })
    if (res.data.code === 0) {
      message.success('删除成功')
      if (dataSource.value.length === 1 && pagination.current && pagination.current > 1) {
        pagination.current -= 1
      }
      fetchUserList()
    } else {
      message.error(res.data.message || '删除失败，请稍后重试')
    }
  } catch (error) {
    message.error('删除失败，请检查网络')
  }
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
:global(.main-content) {
  max-width: none;
  margin: 0;
  padding: 0 32px 64px;
  background: transparent;
}

.admin-page {
  padding: 32px 0 64px;
  background: linear-gradient(180deg, #f7faff 0%, #ffffff 60%);
  min-height: 100%;
}

.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 12px;
}

.page-hero h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
}

.page-hero p {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.query-card,
.table-card {
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(6, 66, 196, 0.08);
}

.query-card {
  margin-bottom: 24px;
  padding-bottom: 12px;
}

.table-card :deep(.ant-table) {
  border-radius: 16px;
}

@media (max-width: 992px) {
  .page-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .query-card {
    overflow-x: auto;
  }
}
</style>
